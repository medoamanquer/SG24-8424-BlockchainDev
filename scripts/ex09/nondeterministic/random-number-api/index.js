'use strict';

// const express = require('express');
// const app = express();
// const PORT = 8080;

// app.get('/random', (req, res) => {
//     let number = Math.floor((Math.random() * 100000) + 1);
//     console.log(`The number generated is: ${number}`);
//     res.status(200).send(`${number}`);
// });

// app.get('/constant', (req, res) => {
//     res.status(200).send(`1995`);
// });

// app.listen(PORT, () => console.log(`Number Generator API listening on port ${PORT}!`));

const http = require('http');
const PORT = 8080;

const server = http.createServer((request, response) => {
    request.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', (err) => {
        console.error(err);
    });
    if (request.method === 'GET' && request.url === '/random') {
        let number = Math.floor((Math.random() * 100000) + 1);
        console.log(`The number generated is: ${number}`);
        response.end(number.toString());
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(PORT);
console.log(`Server running at port ${PORT}`);