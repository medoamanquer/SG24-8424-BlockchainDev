#/bin/bash

printf "\n\nGetting Vehicle AB23 before inspection\n"
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle/AB23'

printf "\n\nGetting Vehicle AB89 before inspection\n"
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle/AB89'

printf "Inspecting Vehicle AB23\n"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class":"org.acme.vehicle_network.InspectVehicle", "vehicle": "org.acme.vehicle_network.Vehicle#AB23" }' 'http://localhost:3000/api/org.acme.vehicle_network.InspectVehicle'

printf "\n\nInspecting Vehicle AB89\n"
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "$class":"org.acme.vehicle_network.InspectVehicle", "vehicle": "org.acme.vehicle_network.Vehicle#AB89" }' 'http://localhost:3000/api/org.acme.vehicle_network.InspectVehicle'
printf "\n"


printf "\n\nGetting Vehicle AB23 after inspection\n"
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle/AB23'

printf "\n\nGetting Vehicle AB89 after inspection\n"
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/org.acme.vehicle_network.Vehicle/AB89'
