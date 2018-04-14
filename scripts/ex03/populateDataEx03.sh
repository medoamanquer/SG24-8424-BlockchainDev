#/bin/bash
printf "Creating Person\n"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.acme.vehicle_network.Person","username": "floura","email": "floura%40email.com"}' 'http://localhost:3000/api/org.acme.vehicle_network.Person'

printf "\n\nCreating Manufacturer\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.acme.vehicle_network.Manufacturer", "companyId": "nicecars",  
   "name": "Nice Cars"}' 'http://localhost:3000/api/org.acme.vehicle_network.Manufacturer'

printf "\n\nCreating Vehicle\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "2FAF", "trim": "Sport","interior": "Leather", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#nicecars","modelType":"Sportino","colour":"Red","yearOfManufacture": 2018}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "\n\nCreating Order\n"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Order", "orderId": "101", "orderStatus": "PLACED", "vehicle": "org.acme.vehicle_network.Vehicle#2FAF", "owner": "org.acme.vehicle_network.Person#floura" }' 'http://localhost:3000/api/org.acme.vehicle_network.Order'

printf "\n\nUpdating Order Status\n"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class":"org.acme.vehicle_network.UpdateOrderStatus", "orderStatus": "DELIVERED", "order":"org.acme.vehicle_network.Order#101" }' 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus'

printf "\n"
