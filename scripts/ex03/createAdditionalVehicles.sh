#/bin/bash
printf "Creating Vehicle with Manufacture date 2000\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "AB23", "trim": "Antique","interior": "Wood", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#nicecars","modelType":"Prudent","colour":"Oak","yearOfManufacture": 2018}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "Creating Vehicle with Manufacture date 2017\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "AB89", "trim": "Futuristic","interior": "Steel", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#nicecars","modelType":"Modernius","colour":"Silver","yearOfManufacture": 2017}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'
printf "\n"
