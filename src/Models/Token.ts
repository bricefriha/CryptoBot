export default class Token {
  id: string = "";
  symbol: string = "";
  name: string = "";
  notificationSent: boolean = false;

  constructor(params : Token) {
      this.id = params.id;
      this.symbol = params.symbol;
      this.name = params.name;
      this.notificationSent = params.notificationSent;
  }
}
