'use strict';
/*
 * Copyright IBM Corp All Rights Reserved
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Chaincode Query
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
const FUNCTION_NAME = 'query.js';
const logger = require('log4js').getLogger('query.js');
logger.setLevel(process.env.LOGLEVEL || 'info');

module.exports = (caller, channelName, peers, chaincode, fcn, args, mspId) => {
    
    return new Promise((resolve, reject) => {
        let fabric_client = new Fabric_Client();

        let channel = fabric_client.newChannel(channelName);
        peers.forEach((peer) => {

            let opt = {};     
            if (peer.tlsCACerts.pem && peer.tlsCACerts.pem !== null && peer.tlsCACerts.pem !== '') {
                opt.pem = peer.tlsCACerts.pem;
            }
            //check if it is grpcs and localhost
            if (_.startsWith(peer.url, 'grpcs://localhost')) {
                opt['ssl-target-name-override'] = peer.name;
            }
            let p = fabric_client.newPeer(peer.url, opt);
            channel.addPeer(p);
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

            var request = {        
                //targets : --- letting this default to the peers assigned to the channel
                chaincodeId: chaincode,
                fcn: fcn,
                args: args,
                chainId: channel.getName()
            };
            logger.debug(`Request Object: ${request}`);
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            logger.debug(`Query has completed, checking results`);
            // query_responses could have more than one results if there multiple peers were used as targets
            if (query_responses && query_responses.length !== 0) {
                if (query_responses[0] instanceof Error) {
                    let message = `Error from query: ${query_responses[0]}`;
                    logger.error(`${message}`);
                    throw new Error(message);
                } else {
                    logger.debug(`Response is: ${query_responses[0].toString()}`);
                    resolve({
                        success: true,
                        message: 'Query success',
                        result: query_responses[0].toString()
                    });
                }
            } else {
                let message = `No payloads were returned from query`;
                throw new Error(message);
            }
        }).catch((err) => {
            console.error('Failed to query successfully :: ' + err);
            reject({
                success: false,
                message: 'Failed to query successfully : ' + err
            });
        });

    });
};