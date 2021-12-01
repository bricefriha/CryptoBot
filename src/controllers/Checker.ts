import Token from "../Models/Token";
import fetch from "node-fetch";

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
        id: "solana",
        symbol: "sol",
        name: "Solana",
      },
      {
        id: "dogecoin",
        symbol: "doge",
        name: "Dogecoin",
      },
      {
        id: "axie-infinity",
        symbol: "axs",
        name: "Axie Infinity",
      },
      {
        id: "shiba-inu",
        symbol: "shib",
        name: "Shiba Inu",
      },
      {
        id: "terra-luna",
        symbol: "luna",
        name: "Terra",
      },
      // 'solana',
      // 'DOGE',
      // 'AXS',
      // 'SHIBE',
      // 'LUNA'
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
            let goodBuy = percentDown > 35;

            console.log("--------------");
            console.log(token.name);
            console.log(`Max: ${maxObj}`);
            console.log(`Current: ${currPrice}`);
            console.log(`Down: ${percentDown.toFixed(2)}%`);
            console.log(`Good buy: ${goodBuy}`);
          });
        });
      }
    }, 60000);
  }
  /**
   * Stop
   */
  public Stop() {
    clearInterval(this._interval);
  }
  public SendNotification(title: string, msg: string) {
    fetch(
      `https://fcm.googleapis.com/v1/projects/cryptobob-eaff8/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer ya29.a0ARrdaM8hVqgOXBwPyTkPGtEnnd0C7H09JOMcmnzu5LSDnVGK6qLBVQejy42MAEOKPYck-Orpai_cPm0dE_mWgCUKfIN46OX6DSHyt5GUbwiik5Pfj2_d6LztKIZ7wbej1E_x5I36HiniMx35fulC1THnWRd_",
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
      console.log(res.status);
    });
  }
}
