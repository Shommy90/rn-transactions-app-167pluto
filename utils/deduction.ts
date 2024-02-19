export const calculateTotalDeduction = (amount: string, fees: any[]) => {
  fees.sort((a, b) => b.minValue - a.minValue);

  const applicableFee = fees.find((fee) => amount >= fee.minValue)?.fee || 0;
  const totalAmount = parseFloat(amount) + parseFloat(applicableFee);

  return totalAmount;
};
