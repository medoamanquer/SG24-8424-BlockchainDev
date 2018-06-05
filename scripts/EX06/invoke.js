'use strict';
/*
 * Copyright IBM Corp All Rights Reserved
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Chaincode Invoke
 */

const Fabric_Client = require('fabric-client');
const path = require('path');
const util = require('util');
const os = require('os');
const fs = require('fs');
const _ = require('lodash');
const environment = process.env.MODE || 'ibp';
const config = require(`./config-${environment}.json`);
const TIMEOUT = config.eventWaitTime || 30000;
const logger = require('log4js').getLogger('invoke.js');
logger.setLevel(process.env.LOGLEVEL || 'info');

module.exports = function invoke(caller, channelName, peers, orderers, chaincode, fcn, args, mspId) {

    return new Promise((resolve, reject) => {
        let fabric_client = new Fabric_Client();

        let channel = fabric_client.newChannel(channelName);

        let targets = [];
        peers.forEach((peer) => {

            let opt = {};     
            if (peer.tlsCACerts.pem && peer.tlsCACerts.pem !== null && peer.tlsCACerts.pem !== '') {
                opt.pem = peer.tlsCACerts.pem;
            }
            //check if it is grpcs and localhost
            if (_.startsWith(peer.url, 'grpcs://localhost')) {
                opt['ssl-target-name-override'] = peer.name;
            }
            opt['request-timeout'] = TIMEOUT;
            let p = fabric_client.newPeer(peer.url, opt);
            channel.addPeer(p);
            targets.push(p);
         });

         orderers.forEach((orderer) => {
            let opt = {};
            if (orderer.tlsCACerts.pem && orderer.tlsCACerts.pem !== null && orderer.tlsCACerts.pem !== '') {
                opt.pem = orderer.tlsCACerts.pem;
            }

            //check if it is grpcs and localhost
            if (_.startsWith(orderer.url, 'grpcs://localhost')) {
                opt['ssl-target-name-override'] = orderer.name;
            }
            opt['request-timeout'] = TIMEOUT;
            channel.addOrderer(fabric_client.newOrderer(orderer.url, opt));
         });


        var member_user = null;
        var store_path = path.join(__dirname, `${config.keyValueStore}/${mspId}`);
        logger.info('Using store path:' + store_path);
        var tx_id = null;
        
        return Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        }).then((state_store) => {     // assign the store to the fabric client
                
            fabric_client.setStateStore(state_store);    
            var crypto_suite = Fabric_Client.newCryptoSuite();     // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
                
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });    
            crypto_suite.setCryptoKeyStore(crypto_store);    
            fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
                
            return fabric_client.getUserContext(caller, true);
        }).then((user_from_store) => {    
            if (user_from_store && user_from_store.isEnrolled()) {        
                logger.info(`Successfully loaded ${caller} from persistence`);        
                member_user = user_from_store;    
            } else {        
                throw new Error(`Failed to get ${caller} from persistence`);    
            }

                 // get a transaction id object based on the current user assigned to fabric client
                
            tx_id = fabric_client.newTransactionID();    
            logger.info("Assigning transaction_id: ", tx_id._transaction_id);

            var request = {        
                targets: targets,
                chaincodeId: chaincode,
                fcn: fcn,
                args: args,
                chainId: channel.getName(),
                txId: tx_id    
            };

            logger.debug(`Request Object: ${request}`);

            // send the transaction proposal to the peers
            return channel.sendTransactionProposal(request);
        }).then((results) => {
                
            var proposalResponses = results[0];
            var proposal = results[1];
            let all_good = true;

            //Check the responses only
            for (var i = 0; i < proposalResponses.length; i++) {
                logger.info(`proposalResponses[${i}].response.status:`, proposalResponses[i].response.status);
                logger.info(`proposalResponses[${i}].response.message:`, proposalResponses[i].response.message);
                let content = proposalResponses[i].response.payload.toString('utf8');
                logger.info(`proposalResponses[${i}].response.payload: ${content}`);

                let one_good = false;
                if (proposalResponses && proposalResponses[i].response && proposalResponses[i].response.status === 200) {
                    one_good = true;
                }

                //all responses must be 200
                all_good = all_good & one_good;
            }

            let rw_set_ok = channel.compareProposalResponseResults(proposalResponses);
            logger.info(`Does RW Set matches for each proposal response: ${rw_set_ok}`);

            if (all_good && rw_set_ok) {  
                logger.info('Successfully sent Proposal and received ProposalResponse');

                ////
                //Build Transaction Promise
                ////

                // build up the request for the orderer to have the transaction committed      
                var request = {            
                    proposalResponses: proposalResponses,
                    proposal: proposal        
                };

                //Get the transaction ID string to be used by the event processing
                        
                var transaction_id_string = tx_id.getTransactionID();        
                var promises = [];

                        
                var sendPromise = channel.sendTransaction(request);
                //we want the send transaction first, so that we know where to check status
                        
                promises.push(sendPromise);

                ////
                //Build Transaction Event Capture Promise
                ////

                let channel_event_hub = channel.newChannelEventHub(targets[0]);
                channel_event_hub.connect(true);
                

                // using resolve the promise so that result status may be processed
                // under the then clause rather than having the catch clause process
                // the status
                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        channel_event_hub.unregisterTxEvent(transaction_id_string);
                        channel_event_hub.disconnect();
                        resolve({
                            event_status: 'TIMEOUT'
                        }); //we could use reject(new Error('Transaction did not complete within 30 seconds'));
                    }, TIMEOUT);
                    
                    channel_event_hub.registerTxEvent(transaction_id_string, (event_tx_id, status, block_num) => {
                        // this is the callback for transaction event status
                        // first some clean up of event listener
                        clearTimeout(handle);
                        channel_event_hub.unregisterTxEvent(transaction_id_string);
                        channel_event_hub.disconnect();
                        logger.info(`Successfully received the transaction event: \nevent_tx_id: ${event_tx_id} \nstatus: ${status} \nblock_num: ${block_num}`);    
                        // now let the application know what happened
                        var return_status = {
                            event_status: status,
                            tx_id: transaction_id_string
                        };
                        if (status !== 'VALID') {
                            logger.error('The transaction was invalid, status = ' + status);
                        }
                        resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
                    }, (err) => {
                        //this is the callback if something goes wrong with the event registration or processing
                        channel_event_hub.unregisterTxEvent(transaction_id_string);
                        channel_event_hub.disconnect();
                        reject(new Error('There was a problem with the eventhub:' + err));
                    });
                });        
                promises.push(txPromise);

                return Promise.all(promises);    
            } else {        
                logger.error('Failed to send Proposal or receive valid response. Response null, status is not 200 or RW set does not match. exiting...');        
                throw new Error('Failed to send Proposal or receive valid response. Response null,  status is not 200 or RW set does not match. exiting...');    
            }
        }).then((results) => {    
            logger.info('Send transaction promise and event listener promise are completed: ', results);

            if (results && results[0] && results[0].status === 'SUCCESS') {       
                logger.info('Successfully sent transaction to the orderer.');  
            } else {       
                logger.error('Failed to order the transaction. Error code: ' + response.status);
                throw new Error('Failed to order the transaction. Error code: ' + response.status);    
            }

            if (results && results[1] && results[1]['event_status'] === 'VALID') {       
                logger.info('Successfully committed the change to the world state by the peer');
                resolve({
                    success: true,
                    message: 'Successfully committed the change to the world state by the peer'
                });
            } else {       
                logger.error('Transaction failed to be committed to the world state due to : ', results[1]); 
                throw new Error('Transaction failed to be committed to the world state due to : ', results[1]); 
            }

        }).catch((err) => {    
            logger.error('Failed to invoke successfully : ' + err);
            reject({
                success: false,
                message: 'Failed to invoke successfully : ' + err
            });
        });
    });
}