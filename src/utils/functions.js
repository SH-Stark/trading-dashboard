import { fPercent } from './formatNumber';

export const getPercentIncrease = (amount, balance) => {
  const changePercent = (amount / (balance - amount)) * 100;

  return fPercent(changePercent);
};
