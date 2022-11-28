import test from "./testclass";
import fetch from "node-fetch";
import Checker from "./controllers/Checker";
import express from "express";
import * as http from 'http';
import * as WebSocket from 'ws';
//console.log(test.sayHello());

// const socket = dnsSocket();
// socket.query(
//   {
//     questions: [
//       {
//         type: "A",
//         name: "google.com",
//       },
//     ],
//   },
//   53,
//   "8.8.8.8",
//   (err: any, res: any) => {
//     console.log(err, res); // prints the A record for google.com
//   }
// );
// Ping the server
// fetch("https://api.coingecko.com/api/v3/ping").then(async (res) => {
//   console.log(res);
//   const body = await res.json();
//   console.log(body);
// });

let checker = new Checker();

checker.Run();
checker.SendNotification("Information", "the server just started");



const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
let ws = new WebSocket.Server({ server });
ws.on('connection', (ws: WebSocket) => {

  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {

      //log the received message and send it back to the client
      console.log('received: %s', message);
      ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
  //start our server
  server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address()} :)`);
  });
});


