#/bin/bash

docker tag hyperledger/fabric-peer:x86_64-1.1.0 hyperledger/fabric-peer:latest
docker tag hyperledger/fabric-orderer:x86_64-1.1.0 hyperledger/fabric-orderer:latest
docker tag hyperledger/fabric-ca:x86_64-1.1.0 hyperledger/fabric-ca:latest
docker tag hyperledger/fabric-couchdb:x86_64-0.4.6 hyperledger/fabric-couchdb:latest
docker tag hyperledger/fabric-ccenv:x86_64-1.1.0 hyperledger/fabric-ccenv:latest
docker tag hyperledger/fabric-javaenv:x86_64-1.1.0 hyperledger/fabric-javaenv:latest
docker tag hyperledger/fabric-tools:x86_64-1.1.0 hyperledger/fabric-tools:latest