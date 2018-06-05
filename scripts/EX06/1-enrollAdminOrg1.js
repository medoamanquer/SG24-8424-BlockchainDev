const logger = require('log4js').getLogger('1-enrollAdminOrg1.js');
const path = require('path');
const loader = require('./loader');
const util = require('util');
const environment = process.env.MODE || 'ibp';
const config = require(`./config-${environment}.json`);
const enrollAdmin = require(`./enroll-admin.js`);

const CHANNEL_NAME = config.channelName;
const CHAINCODE_NAME = config.chaincodeName;

logger.setLevel(process.env.LOGLEVEL || 'info');
const helper = loader(path.join(__dirname, config.connectionProfileDir));

//Get Certificate Authority Object for org1. We will enroll our admin in Org1
//The purpose of the admin is to act as a registrar so that we can register and enroll more users
const casOrg1 = helper.getCASForOrg('org1');
const caOrg1 = casOrg1[0];

return enrollAdmin(caOrg1)
    .then((res) => {
        logger.info(res);
    })
    .catch((err) => {
        logger.error(err);
    });