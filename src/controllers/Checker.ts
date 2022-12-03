import Token from "../Models/Token";
import fetch from "node-fetch";
import { google } from "googleapis";
import key from "../placeholders/firebase.json";
// @ts-ignore
import internet from "../Utility/internet";
import math from "../Utility/Math";
import { string } from "yargs";

const PROJECT_ID = "<YOUR-PROJECT-ID>";
const HOST = "fcm.googleapis.com";
const PATH = "/v1/projects/" + PROJECT_ID + "/messages:send";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];

export default class Checker {
  // List or all the crypto symbols that need to be checked
  //   private _symbols: Array<string>;
  //   public get Symbols(): Array<string> {
  //     return this._symbols;
  //   }
  private _interval: NodeJS.Timer;
  private _tokens: Token[];
  public get Tokens(): Token[] {
    return this._tokens;
  }
  // public set tokens   (v : Array<Token>) {
  //     this._tokens     = v;
  // }
  constructor() {
    this._interval = setInterval(() => {});
    clearInterval(this._interval);

    // All the crypto symbols that need to be checked
    this._tokens = [
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        notificationSent: false,
      },
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        notificationSent: false,
      },
      {
        id: "solana",
        symbol: "sol",
        name: "Solana",
        notificationSent: false,
      },
      {
        id: "cardano",
        symbol: "ada",
        name: "Cardano",
        notificationSent: false,
      },
      {
        id: "dogecoin",
        symbol: "doge",
        name: "Dogecoin",
        notificationSent: false,
      },
      {
        id: "ripple",
        symbol: "xrp",
        name: "XRP",
        notificationSent: false,
      },
      {
        id: "fantom",
        symbol: "ftm",
        name: "Fantom",
        notificationSent: false,
      },
      // {
      //   id: "axie-infinity",
      //   symbol: "axs",
      //   name: "Axie Infinity",
      //   notificationSent: false,
      // },
      // {
      //   id: "shiba-inu",
      //   symbol: "shib",
      //   name: "Shiba Inu",
      //   notificationSent: false,
      // },
      {
        id: "coti",
        symbol: "coti",
        name: "COTI",
        notificationSent: false,
      },
      // {
      //   id: "terra-luna",
      //   symbol: "luna",
      //   name: "Terra",
      //   notificationSent: false,
      // },
      {
        id: "monero",
        symbol: "xmr",
        name: "Monero",
        notificationSent: false,
      },

      {
        id: "enjincoin",
        symbol: "enj",
        name: "Enjin Coin",
        notificationSent: false,
      },
      {
        id: "polkadot",
        symbol: "dot",
        name: "Polkadot",
        notificationSent: false,
      },
      {
        id: "decentraland",
        symbol: "mana",
        name: "Decentraland",
        notificationSent: false,
      },
      {
        id: "gala",
        symbol: "gala",
        name: "Gala",
        notificationSent: false,
      },
      {
        id: "terra-luna",
        symbol: "lunc",
        name: "Terra Luna Classic",
        notificationSent: false,
      },
      // {
      //   id: "osmosis",
      //   symbol: "osmo",
      //   name: "Osmosis",
      //   notificationSent: false,
      // },
      {
        id: "crypto-com-chain",
        symbol: "cro",
        name: "Cronos",
        notificationSent: false,
      },
    ];
  }
  /**
   * Run
   */
  public Run() {
    this._interval = setInterval(() => {
      console.log("--------------");

      console.log(`Time: ${new Date(Date.now()).toUTCString()}`);
      console.log("--------------");

      // Loop symbols
      for (let token of this.Tokens) {
        internet({
          // Provide maximum execution time for the verification
          timeout: 500,
          // If it tries 5 times and it fails, then it will throw no internet
          retries: 1,
        })
          .then(async () => {
            // Get the information about them#

            // get highest value within the last 7 days
            try {
              let pourcentLowWick: Number;
              await fetch(
                `https://api.coingecko.com/api/v3/coins/${token.id}/ohlc?vs_currency=usd&days=14`
              ).then(async (res) => {
                await res.json().then(async (body) => {
                  // Get all the closes
                  let closes: number[] = [];

                  try {
                    body?.forEach((allVal: number[]) => {
                      closes.push(allVal[4]);
                    });
                  } catch (error) {
                    console.warn(error);
                    console.log(body);
                    if (body.status.error_code === 429) {
                      console.warn("Limit reached");
                      return;
                    }
                  }

                  // Get RSI
                  const rsi = math.CalculateRSI(closes);

                  let latest = body[0];

                  // Close
                  let c: number = latest[4];
                  // Low
                  let l: number = latest[3];
                  // Open
                  let o: number = latest[1];
                  let lc = o - l;

                  // avoid 0 division
                  if (lc == 0) pourcentLowWick = 0;
                  else pourcentLowWick = ((c - l) / lc) * 100;
                  // console.log(c);
                  // console.log(c - l);
                  // console.log(lc);
                  // console.log((c - l) / lc);

                  await fetch(
                    `https://api.coingecko.com/api/v3/coins/${token.id}/market_chart?vs_currency=usd&days=15`
                  ).then(async (res) => {
                    await res
                      .json()
                      .then(async (body) => {
                        let allPrices: number[] = [];
                        for (const key of body?.prices) {
                          allPrices.push(key[1]);
                        }

                        let maxObj = allPrices.reduce(function (
                          accumulatedValue: number,
                          currentValue: number
                        ) {
                          return Math.max(accumulatedValue, currentValue);
                        });

                        let currPrice = allPrices[allPrices.length - 1];
                        let percentDown = ((maxObj - currPrice) / maxObj) * 100;
                        let goodBuy = rsi <= 30;
                        let badBuy = rsi >= 40;
                        let goodSell = rsi > 60;
                        let Suggestion = `${
                          badBuy
                            ? "Worst time to buy"
                            : goodBuy
                            ? "best time to buy"
                            : "You can buy"
                        }${goodSell ? ", Best time to sell" : ""}`;
                        console.log("--------------");
                        console.log(token.name);
                        console.log(`Max: ${maxObj}`);
                        console.log(`Current: ${currPrice}`);
                        console.log(`Down: ${percentDown.toFixed(2)}%`);
                        console.log(`Buy signal: ${goodBuy}`);
                        console.log(`Sell signal: ${goodSell}`);
                        console.log(`RSI: ${rsi}`);

                        console.log(`Suggestion: ${Suggestion}`);

                        if (token.notificationSent) {
                          // Note: redendant on perpuse
                          if (!goodBuy) {
                            this.Tokens[
                              this.Tokens.indexOf(token)
                            ].notificationSent = false;
                            //token.notificationSent = false;
                          }
                          return;
                        }

                        if (goodBuy) {
                          // Send notification if it's a goodbuy
                          this.SendNotification(
                            `Buy alert: ${token.name}!!!`,
                            `${token.name} is currently a good buy at $${currPrice}.`
                          );
                          this.Tokens[
                            this.Tokens.indexOf(token)
                          ].notificationSent = true;
                        }
                        if (goodSell) {
                          // Send notification if it's a goodsell
                          this.SendNotification(
                            `Sell alert: ${token.name}!!!`,
                            `If you want to sell ${token.name} now is the time at $${currPrice}.`
                          );

                          this.Tokens[
                            this.Tokens.indexOf(token)
                          ].notificationSent = true;
                        }

                        // Is there is no sell and buy alert?
                        if (!goodBuy && !goodSell && token.notificationSent){
                          // Flag the notification
                          this.Tokens[
                            this.Tokens.indexOf(token)
                          ].notificationSent = true;
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  });
                });
              });
            } catch (error) {
              // if error connection to coin gecko
              console.log(error);
            }
          })
          .catch(() => {
            console.log("No internet");
          });
      }
    }, 100000);
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
  public SendNotification(title: string, msg: string) {
    this.GetToken().then(async (accessToken) => {
      fetch(
        `https://fcm.googleapis.com/v1/projects/cryptobob-eaff8/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
    `,
        }
      ).then(async (res) => {
        console.log(`Notification sent: ${res.status}`);
      });
    });
  }

  private GetToken() {
    return new Promise(function (resolve, reject) {
      ///const key = require(".../placeholders/firebase.json");
      const jwtClient = new google.auth.JWT(
        key.client_email,
        "",
        key.private_key,
        SCOPES,
        ""
      );
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
  private resetConsoleLines() {
    for (let index = 0; index < 6; index++) {
      process.stdout.clearLine(0);
    }
  }
  public ping(host: string): boolean {
    var ImageObject = new Image();
    ImageObject.src = "http://" + host + "/URL/to-a-known-image.jpg"; //e.g. logo -- mind the caching, maybe use a dynamic querystring
    if (ImageObject.height > 0) {
      return true;
    } else {
      return false;
    }
  }
}
