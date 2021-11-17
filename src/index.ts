import test from './testclass';
import fetch from 'node-fetch';

console.log(test.sayHello());
fetch('https://api.coingecko.com/api/v3/ping')
    .then(res => console.log(res));