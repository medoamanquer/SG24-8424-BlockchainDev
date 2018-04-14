#/bin/bash


rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/script.js
rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto
rm ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json

cp ~/Blockchain_Redbook_Application/scripts/ex03/package.json.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/package.json

cp ~/Blockchain_Redbook_Application/scripts/ex03/script.js.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/script.js.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/lib/script.js

cp ~/Blockchain_Redbook_Application/scripts/ex03/org.acme.vehicle_network.cto.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/
mv ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto.ex03 ~/Blockchain_Redbook_Application/vehicle-manufacture-network/models/org.acme.vehicle_network.cto
