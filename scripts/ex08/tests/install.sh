# prereq
# 

 docker exec -ti cli bash -c 'ls /opt/gopath/src/Chain*'

 docker exec -i cli peer chaincode install -n vehicle-chaincode-enc-go -v V1 -p ChainCodeEnc

echo "Sleeping 4s ... "; sleep 4

docker exec -i cli peer chaincode instantiate -o orderer.example.com:7050 -C composerchannel -n vehicle-chaincode-enc-go -v V1 -c '{"Args":[]}' -P "OR('Org1MSP.member')"
