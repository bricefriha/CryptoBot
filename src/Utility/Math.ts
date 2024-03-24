export default class MathC {
  /**
   *  Calcultate ups
   * @param closes list of all the closes
   * @returns all the ups
   */
  private static CalculateUps(closes: number[]): number[] {
    let result: number[] = [];
    let lastClose: number;

    closes.forEach((close) => {
      let index = closes.indexOf(close);
      if (index === 0) return;

      // Result of the calculation
      let res = closes[index] - closes[index - 1];

      // Up=0 if the result is negative
      result.push(res < 0 ? 0 : res);
    });
    return result;
  }
  /**
   *  Calcultate Downs
   * @param closes list of all the closes
   * @returns all the Downs
   */
  private static CalculateDowns(closes: number[]): number[] {
    let result: number[] = [];
    let lastClose: number;

    closes.forEach((close) => {
      let index = closes.indexOf(close);
      if (index === 0) return;

      // Result of the calculation
      let res = closes[index] - closes[index - 1];

      // down=0 if the result is negative
      result.push(res > 0 ? 0 : Math.abs(res));
    });
    return result;
  }
  /**
   * Calculate average
   */
  public static CalcultateAverage(nbs: number[]): number {
    return nbs.reduce((a: number, b: number) => a + b) / nbs?.length;
  }

  public static calculateAverage(arr : number[]) {
      const sum = arr.reduce((acc, val) => acc + val, 0);
      return sum / arr.length;
  }

  /**
   * Calculate an RSI based on close prices
   * @param closes List of closes
   * @returns return the RSI
   */
  public static CalculateRSI(closePrices: number[]): number {
    // // Calculate RS
    // const rs: number =
    //   MathC.calculateAverage(MathC.CalculateUps(closes)) /
    //   MathC.calculateAverage(MathC.CalculateDowns(closes));
  
    // //
    // let t = 100 / (1 + rs);
    // return Math.round(100 - t);
    const period = 14;
    const changes = [];
    for (let i = 1; i < closePrices.length; i++) {
        changes.push(closePrices[i] - closePrices[i - 1]);
    }

    const gains = [];
    const losses = [];
    for (let i = 0; i < changes.length; i++) {
        if (changes[i] > 0) {
            gains.push(changes[i]);
            losses.push(0);
        } else {
            gains.push(0);
            losses.push(-changes[i]);
        }
    }

    const avgGain = this.calculateAverage(gains.slice(0, period));
    const avgLoss = this.calculateAverage(losses.slice(0, period));

    const RS = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const RSI = 100 - (100 / (1 + RS));
    return RSI;
  }
}
