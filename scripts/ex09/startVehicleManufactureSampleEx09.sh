#/bin/bash

printf "Creating Environment..\n"
export FABRIC_VERSION=hlfv11
cd ~/fabric-tools
./startFabric.sh
sleep 5

printf "\nCreating Peer Admin Card..\n"
./createPeerAdminCard.sh
cd ~/Blockchain_Redbook_Application/vehicle-manufacture-network/
npm run prepublish

printf "\nInstalling Vehicle Manufacture Business Network..\n"
composer network install -a dist/vehicle-manufacture-network.bna -c PeerAdmin@hlfv1

printf "\nInstantiating Vehicle Manufacture Business Network..\n"
composer network start -n vehicle-manufacture-network -V 0.2.6 -c PeerAdmin@hlfv1 -A admin -S adminpw -f admin.card

composer card import -f admin.card

rm admin.card
printf "\nPinging Vehicle Manufacture Business Network using Business Network Admin..\n"
composer network ping --card admin@vehicle-manufacture-network


#composer-rest-server -c admin@vehicle-manufacture-network -n always -w true
