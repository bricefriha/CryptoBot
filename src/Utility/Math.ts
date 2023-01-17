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

  /**
   *
   * @param closes List of closes
   * @returns return the RSI
   */
  public static CalculateRSI(closes: number[]): number {
    // Calculate RS
    const rs: number =
      MathC.CalcultateAverage(MathC.CalculateUps(closes)) /
      MathC.CalcultateAverage(MathC.CalculateDowns(closes));

    //
    let t = 100 / (1 + rs);
    return Math.round(100 - t);
  }
}
