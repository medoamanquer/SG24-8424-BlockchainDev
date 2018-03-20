#!/bin/bash

# Exit on first error
set -e
# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo
# check that the composer command exists at a version >v0.14
if hash composer 2>/dev/null; then
    composer --version | awk -F. '{if ($2<15) exit 1}'
    if [ $? -eq 1 ]; then
        echo 'Sorry, Use createConnectionProfile for versions before v0.15.0' 
        exit 1
    else
        echo Using composer-cli at $(composer --version)
    fi
else
    echo 'Need to have composer-cli installed at v0.15 or greater'
    exit 1
fi
# need to get the certificate 


PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk
CERT="${DIR}"/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem

if composer card list -n PeerAdmin@hlfv1 > /dev/null; then
    composer card delete -n PeerAdmin@hlfv1
fi
composer card create -p ./connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin -r ChannelAdmin --file ./PeerAdmin@hlfv1.card
composer card import --file ./PeerAdmin@hlfv1.card 


echo "Hyperledger Composer PeerAdmin card has been imported"
composer card list

