set -e

export MYKEY=`echo "mysecret00000000000000000000000" | base64`

docker exec -i cli peer chaincode invoke -o orderer.example.com:7050 -C composerchannel -n vehicle-chaincode-enc-go -c '{"Args":["recordVehicleEnc", "4", "secret car", "Blue", "1504054226", "Europe", "Robert"]}' --transient "{\"ENCKEY\":\"${MYKEY}\"}"

sleep 3

curl -s -X GET http://127.0.0.1:5984/composerchannel_vehicle-chaincode-enc-go/4 | jq

docker exec -i cli peer chaincode query -C composerchannel -n vehicle-chaincode-enc-go -c '{"Args":["queryVehicleEnc","4"]}' --transient "{\"DECKEY\":\"${MYKEY}\"}"


