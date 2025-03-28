import { BsCurrencyDollar, BsCurrencyEuro, BsCurrencyPound } from "react-icons/bs";
import { FaGlobe, FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";
import { Currency, Region, Vacuum } from "./database";

export type WithId<T> = T & { id: string };

export type VacuumsFilters = Omit<
  Vacuum,
  "id" | "imageUrl" | "model" | "otherFeatures" | "userEmail" | "createdAt" | "updatedAt"
> & {
  brand?: string;
  model?: string;
  budget?: number;
  numPets?: number;
  region?: Region;
  currency?: Currency;
};

export const SUPPORTED_REGIONS: Region[] = ["americas", "europe", "asia", "africa", "australia"];
export const SUPPORTED_CURRENCIES: Currency[] = ["usd", "eur"];

export const RegionIconMapping: {
  [type in Region]: React.ComponentType<{ className: string }>;
} = {
  americas: FaGlobeAmericas,
  europe: FaGlobeEurope,
  asia: FaGlobeAsia,
  africa: FaGlobeAfrica,
  australia: FaGlobe,
};

export const CurrencyIconMapping: {
  [type in Currency]: React.ComponentType<{ className: string }>;
} = {
  usd: BsCurrencyDollar,
  eur: BsCurrencyEuro,
  gbp: BsCurrencyPound,
  aud: BsCurrencyDollar,
  zar: BsCurrencyDollar,
};
export const CurrencySymbolMapping: {
  [type in Currency]: string;
} = {
  usd: "$",
  eur: "€",
  gbp: "£",
  aud: "A$",
  zar: "R",
};
