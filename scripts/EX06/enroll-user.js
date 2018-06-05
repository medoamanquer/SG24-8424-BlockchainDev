'use strict';
/*
 * Copyright IBM Corp All Rights Reserved
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Enroll the admin user
 */

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var util = require('util');
var os = require('os');
const environment = process.env.MODE || 'ibp';
var config = require(`./config-${environment}.json`);
const logger = require('log4js').getLogger('enroll-user.js');
logger.setLevel(process.env.LOGLEVEL || 'info');

var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;

module.exports = (ca, username) => {

    return new Promise((resolve, reject) => {

        var store_path = path.join(__dirname, `${config.keyValueStore}/${ca['x-mspid']}`);
        logger.info('Using store path:' + store_path);

        Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        }).then((state_store) => {

            fabric_client.setStateStore(state_store);
            var crypto_suite = Fabric_Client.newCryptoSuite();
            var crypto_store = Fabric_Client.newCryptoKeyStore({
                path: store_path
            });
            crypto_suite.setCryptoKeyStore(crypto_store);
            fabric_client.setCryptoSuite(crypto_suite);
            var tlsOptions = {
                trustedRoots: [],
                verify: false
            };

            fabric_ca_client = new Fabric_CA_Client(ca.url, tlsOptions, ca.caName, crypto_suite);

            return fabric_client.getUserContext(ca.registrar[0].enrollId, true);
        }).then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                logger.info(`Successfully loaded ${ca.registrar[0].enrollId} from persistence`);
                admin_user = user_from_store;

            } else {
                throw new Error(`${ca.registrar[0].enrollId} is not found`);
            }

            return fabric_ca_client.register({
                enrollmentID: username,
                affiliation: `${ca.orgName}.department1`,
                role: 'client'
            }, admin_user);
        }).then((secret) => {
            // next we need to enroll the user with CA server
            logger.info(`Successfully registered ${username} - secret:` + secret);
    
            return fabric_ca_client.enroll({
                enrollmentID: username,
                enrollmentSecret: secret
            });
        }).then((enrollment) => {
            logger.info(`Successfully enrolled member user ${username} `);
            return fabric_client.createUser({
                username: username,
                mspid: ca['x-mspid'],
                cryptoContent: {
                    privateKeyPEM: enrollment.key.toBytes(),
                    signedCertPEM: enrollment.certificate
                }
            });
        }).then((user) => {
            member_user = user;
    
            return fabric_client.setUserContext(member_user);
        }).then(() => {
            logger.info(`${username} was successfully registered and enrolled and is ready to interact with the fabric network`);
            resolve({
                success: true,
                message: `${username} was successfully registered and enrolled and is ready to interact with the fabric network`
            });
        }).catch((err) => {
            logger.error('Failed to register: ' + err);
            reject({
                success: false,
                message: 'Failed to register: ' + err
            });
        });
    });
};