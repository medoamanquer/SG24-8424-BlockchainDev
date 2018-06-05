const logger = require('log4js').getLogger('3-createVehicle.js');
const path = require('path');
const loader = require('./loader');
const util = require('util');
const environment = process.env.MODE || 'ibp';
const config = require(`./config-${environment}.json`);
const invoke = require('./invoke.js');

const CHANNEL_NAME = config.channelName;
const CHAINCODE_NAME = config.chaincodeName;

logger.setLevel(process.env.LOGLEVEL || 'info');
const helper = loader(path.join(__dirname, config.connectionProfileDir));

//Get Certificate Authority Object for org1.
const casOrg1 = helper.getCASForOrg('org1');
const caOrg1 = casOrg1[0];

//The user that we register and enroll in previous step will be the one invoking the transaction
const caller = 'Kasia';

//Set the vehicle details
const id = '2';
const modelType = 'IBP Car';
const colour = 'Pink';
const timestamp = '1504054226';
const location = 'Europe';
const owner = 'Thugo';

const functionName = 'recordVehicle';
let args = [id, modelType, colour, timestamp, location, owner];

return invoke(caller, CHANNEL_NAME, helper.getUniquePeersForChannel(CHANNEL_NAME), helper.getUniqueOrderersForChannel(CHANNEL_NAME), CHAINCODE_NAME, functionName, args, caOrg1['x-mspid'])
    .then((res) => {
        logger.info(res);
    })
    .catch((err) => {
        logger.error(err);
    });

