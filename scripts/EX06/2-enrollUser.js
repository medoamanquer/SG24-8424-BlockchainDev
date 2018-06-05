const logger = require('log4js').getLogger('2-enrollUser.js');
const path = require('path');
const loader = require('./loader');
const util = require('util');
const environment = process.env.MODE || 'ibp';
const config = require(`./config-${environment}.json`);
const enrollUser = require('./enroll-user.js');

const CHANNEL_NAME = config.channelName;
const CHAINCODE_NAME = config.chaincodeName;

logger.setLevel(process.env.LOGLEVEL || 'info');
const helper = loader(path.join(__dirname, config.connectionProfileDir));

//Get Certificate Authority Object for org1. Using registrar admin registered previously, we enroll a new user
const casOrg1 = helper.getCASForOrg('org1');
const caOrg1 = casOrg1[0];

return enrollUser(caOrg1, 'Kasia')
    .then((res) => {
        logger.info(res);
    })
    .catch((err) => {
        logger.error(err);
    });
