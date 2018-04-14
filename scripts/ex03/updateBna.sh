#/bin/bash


rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/script.js
rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto
rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json

cp ~/Blockchain_Redbook_Application/scripts/ex03/package.json.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json

cp ~/Blockchain_Redbook_Application/scripts/ex03/script.js.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/script.js.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/script.js

cp ~/Blockchain_Redbook_Application/scripts/ex03/org.acme.vehicle_network.cto.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto

#cd ~/Blockchain_Redbook_Application/vehicle-manufacture-network/
#npm run prepublish

#printf "\nInstalling Vehicle Manufacture Business Network..\n"
#composer network install -a dist/vehicle-manufacture-network.bna -c PeerAdmin@hlfv1

#printf "\nUpgrade Vehicle Manufacture Business Network..\n"
#composer network upgrade -n vehicle-manufacture-network -V 0.2.5 -c PeerAdmin@hlfv1

#printf "\nPinging Vehicle Manufacture Business Network using Business Network Admin..\n"
#composer network ping --card admin@vehicle-manufacture-network

