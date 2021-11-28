import Token from "../Models/Token";
import fetch from "node-fetch";

export default class Checker {
  // List or all the crypto symbols that need to be checked
  //   private _symbols: Array<string>;
  //   public get Symbols(): Array<string> {
  //     return this._symbols;
  //   }

  private _tokens: Token[];
  public get Tokens(): Token[] {
    return this._tokens;
  }

  private _arrayTok: string;
  public get ArrayTok(): string {
    return this._arrayTok;
  }
  // public set tokens   (v : Array<Token>) {
  //     this._tokens     = v;
  // }

  constructor() {
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
    console.log(this._tokens);
    // Loop symbols
    for (let token of this.Tokens) {
      // Get the information about them#

      // get highest value within the last 7 days
      fetch(
        `https://api.coingecko.com/api/v3/coins/${token.id}/market_chart?vs_currency=usd&days=7`
      ).then(async (res) => {
        await res.json().then((body) => {
          // get the hisghest value
          // var maxObj = body.reduce(function (max: number, obj: Array<number>) {
          //   let current = obj[1];
          //   return current > max ? current : max;
          // });
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
          console.log("--------------");
          console.log(token.name);
          console.log(`max: ${maxObj}`);
          console.log(`current: ${allPrices[allPrices.length - 1]}`);
        });
      });
    }
  }
}
