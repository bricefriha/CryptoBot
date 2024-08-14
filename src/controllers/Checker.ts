import Token from "../Models/Token.ts";
import fetch, {Response, Error} from "node-fetch";
import {google} from "googleapis";
const key = JSON.parse(Deno.readTextFileSync(`${Deno.cwd()}/src/placeholders/firebase.json`));
const tokens = JSON.parse(Deno.readTextFileSync(`${Deno.cwd()}/src/placeholders/tokens.json`));
import internet from "../Utility/Internet.ts";
import math from "../Utility/Math.ts";
import CoinsProcess from "./CoinsProcess.ts";
const HOST = "fcm.googleapis.com";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

export default class Checker {
    private _interval ;
    private _tokens : Token[];
    public get Tokens(): Token[]{
        return this._tokens;
    }
    
    constructor() {
        this._interval = setInterval(() => {});
        clearInterval(this._interval);
        this._tokens = [];
        // All the crypto symbols that need to be checked

        for (let i: number = 0; i < tokens.length; ++i)
            this._tokens.push(new Token({
                                id: tokens[i].id,
                                symbol: tokens[i].symbol,
                                name: tokens[i].name,
                                notificationSent: false 
                            }));
    }
        
    /**
   * Run
   */
    public Run() {
        this._interval = setInterval(() => {
            console.log("--------------");

            console.log(`Time: ${
                new Date(Date.now()).toUTCString()
            }`);
            console.log("--------------");

            // Loop symbols
            for (const token of this._tokens) {
                internet({
                  timeout: 500,
                  retries: 1,
                  domainName: "",
                  port: 0,
                  host: ""
                }).then(async () => {
                    const tokenIndex = this.Tokens.indexOf(token);
                    const closes: number[] = [];
                    
                    // Get the history of the token
                    const values = await CoinsProcess.GetHistory(token.id);
                    
                    if (!values) {
                        console.log("-----");
                        console.log(`${token.name} not found`);
                        return;
                    }
                    // Get all closes
                    for (let i: number = 0; i < values.length; ++i){
                        closes.push(+values[i].priceUsd)
                    }
                    // Get RSI
                    const rsi = math.CalculateRSI(closes);

                    // Get the current price
                    const currPrice = values[0];
                    
                    console.log("-----");
                    console.log(`${token.name}: ${rsi}`);
                    let goodBuy = rsi<= 35;
                    let badBuy = rsi >= 50;
                    let goodSell = rsi > 60;
                    const Suggestion = `${
                        badBuy ? "Worst time to buy" : goodBuy ? "best time to buy" : "You can buy"
                    }${
                        goodSell ? ", Best time to sell" : ""
                    }`;
                    console.log(Suggestion);

                  if (goodBuy) { // Send notification if it's a goodbuy
                      this.SendNotification(`Buy alert: ${
                          token.name
                      }!!!`, `${
                          token.name
                      } is currently a good buy at $${currPrice}.`);
                      this.Tokens[tokenIndex] = {
                          id: token.id,
                          name: token.name,
                          symbol: token.symbol,
                          notificationSent: true

                      };
                  }
                  if (goodSell) { // Send notification if it's a goodsell
                      this.SendNotification(`Sell alert: ${
                          token.name
                      }!!!`, `If you want to sell ${
                          token.name
                      } now is the time at $${currPrice}.`);
                      this.Tokens[tokenIndex] = {
                          id: token.id,
                          name: token.name,
                          symbol: token.symbol,
                          notificationSent: true

                      };
                  }
                }).catch((err : any) => {
                    console.log(err);
                });
            }
        }, 15000);
    }
    /**
   * Stop
   */
    public Stop() {
        clearInterval(this._interval);
    }
    /**
   * Send a notification
   * @param title tile of the notification
   * @param msg content of the notification
   */
    public SendNotification(title : string, msg : string) {
        this.GetToken().then((accessToken) => {
            fetch(`https://${HOST}/v1/projects/cryptobob-eaff8/messages:send`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: `
        {
  "message": {
    "notification": {
      "title": "${title}",
      "body": "${msg}"
    },
    "condition": "'allDevices' in topics || 'android' in topics || 'ios' in topics"
    
  }
}
    `
            }).then(async (res : Response) => {
                console.log(`Notification sent: ${
                    res.status
                }`);
            });
        });
    }

    private GetToken() {
        return new Promise(function (resolve, reject) { // /const key = require(".../placeholders/firebase.json");
            const jwtClient = new google.auth.JWT(key.client_email, "", key.private_key, SCOPES, "");
            jwtClient.authorize(async (err, tokens) => {
                if (tokens) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(tokens.access_token);
                }
            });
        });
    }
    // private resetConsoleLines() {
    //     for (let index = 0; index < 6; index++) {
    //         process.stdout.clearLine(0);
    //     }
    // }
    // public ping(host : string): boolean {
    //     const ImageObject = new Image();
    //     ImageObject.src = `http://${host}"/URL/to-a-known-image.jpg`; // e.g. logo -- mind the caching, maybe use a dynamic querystring
    //     if (ImageObject.height > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}
