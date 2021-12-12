import test from "./testclass";
import fetch from "node-fetch";
import Checker from "./controllers/Checker";
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
