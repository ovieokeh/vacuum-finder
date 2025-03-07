import { Vacuum } from "../types";

export const getCheapestPrice = (vacuum: Vacuum, currency: string) => {
  const affiliateLinks = vacuum.affiliateLinks || [];
  if (affiliateLinks.length === 0) {
    return 0;
  }

  let cheapestPrice = Infinity;
  for (const link of affiliateLinks) {
    if (link.currency.toLowerCase() === currency.toLowerCase() && link.price < cheapestPrice) {
      cheapestPrice = link.price;
    }
  }

  if (cheapestPrice === Infinity) {
    return -1;
  }

  return cheapestPrice;
};
