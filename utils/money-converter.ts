export const convertToMoney = (value: number) => {
  if (value >= 0 && value < 1000) {
    return value.toFixed(2);
  } else {
    return Math.floor(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};
