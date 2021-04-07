const roundDigits = (num, maxNumDecimals = 4) => {
  const factor = 10 ** maxNumDecimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
};

export {roundDigits};
