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
}
