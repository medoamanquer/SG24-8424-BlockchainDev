#/bin/bash

printf "Destroying Environment After Ex04 ..\n"
export FABRIC_VERSION=hlfv11
cd ~/fabric-tools
./teardownFabric.sh
sleep 5

printf "\nRemoving cards\n"
composer card delete --card admin@vehicle-manufacture-network
composer card delete --card PeerAdmin@hlfv1
