'use strict';

const FabricClient = require('fabric-client');
const FabricCAClient = require('fabric-ca-client');

const path = require('path');
const util = require('util');
const os = require('os');

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require('composer-admin').AdminConnection;
const IdCard = require('composer-common').IdCard;
const FileSystemCardStore = require('composer-common').FileSystemCardStore;
const connectionProfile = {
    "name": "hlfv1",
    "type": "hlfv1",
    "orderers": [
       { "url" : "grpc://localhost:7050" }
    ],
    "ca": { "url": "http://localhost:7054", "name": "ca.org1.example.com"},
    "peers": [
        {
            "requestURL": "grpc://localhost:7051",
            "eventURL": "grpc://localhost:7053"
        }
    ],
    "channel": "composerchannel",
    "mspID": "Org1MSP",
    "timeout": 300
};


//
var fabricClient = new FabricClient();
var fabricCaClient = null;
var adminUser = null;
var memberUser = null;
var storePath = path.join(__dirname, 'hfc-key-store');
var cardPath = path.join(__dirname,'composer-card-store');
var cardStore = new FileSystemCardStore({storePath: cardPath});
let adminConnection = new AdminConnection({cardStore: cardStore});
let businessNetworkConnection = new BusinessNetworkConnection({cardStore: cardStore});
FabricClient.newDefaultKeyValueStore({path: storePath}).then(
    (stateStore) => {
        fabricClient.setStateStore(stateStore);
        var cryptoSuite = FabricClient.newCryptoSuite();
        var cryptoStore = FabricClient.newCryptoKeyStore({path: storePath});
        cryptoSuite.setCryptoKeyStore(cryptoStore);
        fabricClient.setCryptoSuite(cryptoSuite);
        return fabricClient.getUserContext('admin', true);
    }
).then(
    userFromStore => {
        adminUser = userFromStore;
        return adminUser.getSigningIdentity();
    }
).then(
    userIdentity => {
        let metadata = {
            "version": 1,
            "userName": adminUser.getName(),
            "description": "Admin card from the sdk Yuppy",
            "roles": [
                "PeerAdmin","ChannelAdmin"
            ]
        };
        let idCardData = new IdCard(metadata,connectionProfile);
        let idCardName = "consumer1@voucher-network";
        idCardData.setCredentials({certificate: userIdentity._certificate, privateKey: userIdentity._signer._key.toBytes()})
       return adminConnection.importCard(idCardName,idCardData);
    }
).then(
   () => adminConnection.disconnect()
);