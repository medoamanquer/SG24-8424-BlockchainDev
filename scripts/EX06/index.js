const logger = require('log4js').getLogger();
const path = require('path');
const loader = require('./loader');
const util = require('util');
const environment = process.env.MODE || 'ibp';
var config = require(`./config-${environment}.json`);
const enrollAdmin = require(`./enroll-admin.js`);
const enrollUser = require('./enroll-user.js');
const invoke = require('./invoke.js');
const query = require('./query.js');

const CHANNEL_NAME = config.channelName;
const CHAINCODE_NAME = config.chaincodeName;

logger.setLevel(process.env.LOGLEVEL || 'debug');
const helper = loader(path.join(__dirname, config.connectionProfileDir));


const CAS = helper.getCASForOrg('org1');
const CA = CAS[0];


// return enrollAdmin(CA)
//     .then((res) => {
//         logger.info(res);
//     })
//     .then((res) => {
//         logger.info(res);
//     });


// return enrollUser(CA, 'org1', 'robert')
// .then((res) => {
//     logger.info(res);
// })
// .catch((err) => {
//     logger.error(err);
// });

// var args = ['2', 'next car', 'Blue', '1504054226', 'Europe', 'Thugo'];
// return invoke('robert', CHANNEL_NAME, helper.getUniquePeersForChannel(CHANNEL_NAME), helper.getUniqueOrderersForChannel(CHANNEL_NAME), CHAINCODE_NAME, 'recordVehicle', args, CA['x-mspid'])
//     .then((res) => {
//         logger.info(res);
//     })
//     .catch((err) => {
//         logger.error(err);
//     });

return query('robert', CHANNEL_NAME, helper.getUniquePeersForChannel(CHANNEL_NAME), CHAINCODE_NAME, 'queryVehicle', ['2'], CA['x-mspid'])
    .then((res) => {
        logger.info(res)
    })
    .catch((err) => {
        logger.error(err);
    });