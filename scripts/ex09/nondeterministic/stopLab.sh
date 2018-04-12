#/bin/bash

echo "Stopping Fabric Network..."
./byfn.sh -m down

echo "Removing PeerAdmin Card"
composer card delete --name PeerAdmin@byfn-network-org1

echo "Removing Business Network Admin Card"
composer card delete --name alice@nondeterministic-network