import Token from "../Models/Token";
import fetch from "node-fetch";
import { google } from "googleapis";
import key from "../placeholders/firebase.json";

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
        id: "dogecoin",
        symbol: "doge",
        name: "Dogecoin",
        notificationSent: false,
      },
      {
        id: "axie-infinity",
        symbol: "axs",
        name: "Axie Infinity",
        notificationSent: false,
      },
      {
        id: "shiba-inu",
        symbol: "shib",
        name: "Shiba Inu",
        notificationSent: false,
      },
      {
        id: "coti",
        symbol: "coti",
        name: "COTI",
        notificationSent: false,
      },
      {
        id: "terra-luna",
        symbol: "luna",
        name: "Terra",
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

      // method to be executed;

      // Loop symbols
      for (let token of this.Tokens) {
        // Get the information about them#

        // get highest value within the last 7 days
        try {
          fetch(
            `https://api.coingecko.com/api/v3/coins/${token.id}/market_chart?vs_currency=usd&days=7`
          ).then(async (res) => {
            await res.json().then((body) => {
              let allPrices: number[] = [];
              for (const key of body.prices) {
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
              let goodBuy = percentDown >= 29.5;

              console.log("--------------");
              console.log(token.name);
              console.log(`Max: ${maxObj}`);
              console.log(`Current: ${currPrice}`);
              console.log(`Down: ${percentDown.toFixed(2)}%`);
              console.log(`Buy signal: ${goodBuy}`);

              if (token.notificationSent) {
                // Note: redendant on perpuse
                if (!goodBuy) {
                  this.Tokens[this.Tokens.indexOf(token)].notificationSent =
                    false;
                  //token.notificationSent = false;
                }
                return;
              }

              if (goodBuy) {
                // Send notification if it's a goodby
                this.SendNotification(
                  `Buy alert: ${token.name}!!!`,
                  `${token.name} is currently a good buy at $${currPrice}.`
                );
                this.Tokens[this.Tokens.indexOf(token)].notificationSent = true;
              }
            });
          });
        } catch (error) {
          // if error connection to coin gecko
          console.log(error);
        }
      }
    }, 30000);
  }
  /**
   * Stop
   */
  public Stop() {
    clearInterval(this._interval);
  }
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
}
