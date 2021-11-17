import test from './testclass';
import fetch from 'node-fetch';

console.log(test.sayHello());

// Ping the server
fetch('https://api.coingecko.com/api/v3/ping')
    .then(async (res) => {
        const body = await res.json();

        console.log(body);
    });