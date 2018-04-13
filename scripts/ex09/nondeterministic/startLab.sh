#/bin/bash

echo "Starting Fabric Network..."
./byfn.sh -m up -a

echo "Import PeerAdmin Card"
composer card import -f composer-artifacts/PeerAdmin\@byfn-network-org1.card --card PeerAdmin@byfn-network-org1

echo "Import Business Network Admin Card"
composer card import -f composer-artifacts/alice\@nondeterministic-network.card

echo "Creating BNA"
cd nondeterministic-network
npm run prepublish
cd ..

echo "Install Business Network"
composer network install -a nondeterministic-network/dist/nondeterministic-network.bna -c PeerAdmin@byfn-network-org1
#composer runtime install --card PeerAdmin@byfn-network-org1 --businessNetworkName nondeterministic-network

echo "Start Business Network"
composer network start -c PeerAdmin@byfn-network-org1 -n nondeterministic-network -V 0.1.2 -o endorsementPolicyFile=composer-artifacts/endorsement-policy.json -A alice -C composer-artifacts/alice/admin-pub.pem
#composer network start --card PeerAdmin@byfn-network-org1 --archiveFile nondeterministic-network/dist/nondeterministic-network.bna -o endorsementPolicyFile=composer-artifacts/endorsement-policy.json -A alice -C composer-artifacts/alice/admin-pub.pem

echo "Start REST Server"
composer-rest-server -c alice@nondeterministic-network -n always -w true

# Issue these in separate terminals
#docker logs -f --since $(date --rfc-3339=seconds | sed 's/ /T/')  dev-peer0.org1.example.com-nondeterministic-network-0.18.2 2>&1 | grep @debug
#docker logs -f --since $(date --rfc-3339=seconds | sed 's/ /T/')  dev-peer1.org1.example.com-nondeterministic-network-0.18.2 2>&1 | grep @debug
