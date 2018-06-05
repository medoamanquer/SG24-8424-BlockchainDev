const logger = require('log4js').getLogger('4-queryVehicle.js');
const path = require('path');
const loader = require('./loader');
const util = require('util');
const environment = process.env.MODE || 'ibp';
const config = require(`./config-${environment}.json`);
const query = require('./query.js');

const CHANNEL_NAME = config.channelName;
const CHAINCODE_NAME = config.chaincodeName;

logger.setLevel(process.env.LOGLEVEL || 'info');
const helper = loader(path.join(__dirname, config.connectionProfileDir));

//Get Certificate Authority Object for org1.
const casOrg1 = helper.getCASForOrg('org1');
const caOrg1 = casOrg1[0];

//The user that we register and enroll in previous step will be the one performing the query
const caller = 'Kasia';
const vehicleId = '2';

const functionName = 'queryVehicle';

//We will query the vehicle with id 2 that is inserted in the previous step
return query(caller, CHANNEL_NAME, helper.getUniquePeersForChannel(CHANNEL_NAME), CHAINCODE_NAME, functionName, [vehicleId], caOrg1['x-mspid'])
    .then((res) => {
        logger.info(res)
    })
    .catch((err) => {
        logger.error(err);
    });

