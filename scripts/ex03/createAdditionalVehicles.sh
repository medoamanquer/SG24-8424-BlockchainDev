#/bin/bash
printf "Creating Vehicle with Manufacture date 2031\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "AB23", "trim": "Antique","interior": "Wood", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#nicecars","modelType":"Prudent","colour":"Oak","yearOfManufacture": 2031}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "\n\nCreating Vehicle with Manufacture date 2019\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "AB89", "trim": "Futuristic","interior": "Steel", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#nicecars","modelType":"Modernius","colour":"Silver","yearOfManufacture": 2019}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'
printf "\n"
