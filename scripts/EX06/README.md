# Interacting with IBP

1. Switch directory into this folder: ```cd IBP-client```
2. If this is NOT a new IBP deployment, then ```rm -rf fabric-client-kvs_*```
3. Delete the files in **connection_profile/ibp** folder
4. ```npm install```
5. In IBP, Create channel (name: **composerchannel**), join peers in both organizations into the channel, install chaincode into both peers (name: **vehicle-chaincode**, upload file from **chaincode** directory) and instantiate chaincode in one of the peers
6. Download connection profile file from each organizations (total should be two) and place them in **connection_profile/ibp** folder
7. Observe and execute the scripts **1-enrollAdminOrg1.js**, **2-enrollUser.js**,  **3-createVehicle.js** and  **4-queryVehicle.js**

The code will load connection profiles and target peers from all organizations during invocation. Note during the first invoke, it will take a long time as IBP will spin up a chaincode container for the peer in the other organization (instantiation only spins up a chaincode container in the specified peer)
