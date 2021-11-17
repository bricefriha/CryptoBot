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
    // Loop symbols
    for (let token of this.Tokens) {
      // Get the information about them#
      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token.id}%2C&vs_currencies=usd`
      ).then(async (res) => {
        const body = await res.json();

        console.log(body);
      });
    }
  }
}
