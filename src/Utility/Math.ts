/**
 *  Calcultate ups
 * @param closes list of all the closes
 * @returns all the ups
 */
function CalculateUps(closes: Int16Array): number[] {
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
function CalculateDowns(closes: Int16Array): number[] {
  let result: number[] = [];
  let lastClose: number;

  closes.forEach((close) => {
    let index = closes.indexOf(close);
    if (index === 0) return;

    // Result of the calculation
    let res = closes[index] - closes[index - 1];

    // down=0 if the result is negative
    result.push(res > 0 ? 0 : res);
  });
  return result;
}
/**
 * Calculate average
 */
function CalcultateAverage(nbs: number[]): number {
  return nbs.reduce((a: number, b: number) => a + b) / nbs.length;
}

/**
 *
 * @param closes List of closes
 * @returns return the RSI
 */
function CalculateRSI(closes: Int16Array): number {
  // Calculate RS
  const rs: number =
    CalcultateAverage(CalculateUps(closes)) /
    CalcultateAverage(CalculateDowns(closes));

  //
  return 100 / 1 + rs;
}
