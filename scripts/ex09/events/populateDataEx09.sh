#/bin/bash
# printf "Creating Person 1\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.acme.vehicle_network.Person","username": "eunike","email": "eunike%40email.com"}' 'http://localhost:3000/api/org.acme.vehicle_network.Person'

# printf "\n\nCreating Person 2\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.acme.vehicle_network.Person","username": "boni","email": "bonifasius%40email.com"}' 'http://localhost:3000/api/org.acme.vehicle_network.Person'

# printf "\n\nCreating Person 3\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.acme.vehicle_network.Person","username": "anastasia","email": "anastasia%40email.com"}' 'http://localhost:3000/api/org.acme.vehicle_network.Person'

# printf "\n\nCreating Person 4\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.acme.vehicle_network.Person","username": "invi","email": "invi%40email.com"}' 'http://localhost:3000/api/org.acme.vehicle_network.Person'

printf "\n\nCreating Manufacturer\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.acme.vehicle_network.Manufacturer", "companyId": "awesomecars",  
   "name": "Awesome Cars"}' 'http://localhost:3000/api/org.acme.vehicle_network.Manufacturer'

printf "\n\nCreating Vehicle 1\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "80KH", "trim": "Elegant","interior": "Suede", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#awesomecars","modelType":"Primo","colour":"Black","yearOfManufacture": 2018}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "\n\nCreating Vehicle 2\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "81AB", "trim": "Economy","interior": "Plastic", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#awesomecars","modelType":"Duramo","colour":"Yellow","yearOfManufacture": 2025}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "\n\nCreating Vehicle 3\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "71QR", "trim": "Military","interior": "Steel", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#awesomecars","modelType":"Panther","colour":"Yellow","yearOfManufacture": 2027}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

printf "\n\nCreating Vehicle 4\n"
 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Vehicle", "vin": "89VP", "trim": "Luxury","interior": "Carbon", "extras": [],"make": "org.acme.vehicle_network.Manufacturer#awesomecars","modelType":"Luxor","colour":"Blue","yearOfManufacture": 2029}' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle'

# printf "\n\nCreating Order 1\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Order", "orderId": "102", "orderStatus": "PLACED", "vehicle": "org.acme.vehicle_network.Vehicle#80KH", "owner": "org.acme.vehicle_network.Person#eunike" }' 'http://localhost:3000/api/org.acme.vehicle_network.Order'

# printf "\n\nCreating Order 2\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Order", "orderId": "103", "orderStatus": "PLACED", "vehicle": "org.acme.vehicle_network.Vehicle#81AB", "owner": "org.acme.vehicle_network.Person#boni" }' 'http://localhost:3000/api/org.acme.vehicle_network.Order'

# printf "\n\nCreating Order 3\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Order", "orderId": "104", "orderStatus": "PLACED", "vehicle": "org.acme.vehicle_network.Vehicle#71QR", "owner": "org.acme.vehicle_network.Person#anastasia" }' 'http://localhost:3000/api/org.acme.vehicle_network.Order'

# printf "\n\nCreating Order 4\n"
# curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class": "org.acme.vehicle_network.Order", "orderId": "105", "orderStatus": "PLACED", "vehicle": "org.acme.vehicle_network.Vehicle#89VP", "owner": "org.acme.vehicle_network.Person#invi" }' 'http://localhost:3000/api/org.acme.vehicle_network.Order'

printf "\n"
