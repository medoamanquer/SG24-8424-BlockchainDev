#/bin/bash

printf 'Create Stock (Deterministic)..'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class":"org.nondeterministic.Stock","id": "CONGO", "price": 500}' 'http://localhost:3000/api/org.nondeterministic.Stock'

printf 'Create Stock (Non-Deterministic)..'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{"$class": "org.nondeterministic.CreateStock","stockId": "IBM"}' 'http://localhost:3000/api/org.nondeterministic.CreateStock'