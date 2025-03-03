/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";
import { BsCurrencyDollar, BsCurrencyEuro } from "react-icons/bs";
import { FaGlobeAfrica, FaGlobeAmericas, FaGlobeAsia, FaGlobeEurope } from "react-icons/fa";

export enum Region {
  America = "America",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
}
export const RegionIconMapping = {
  [Region.America]: FaGlobeAmericas,
  [Region.Europe]: FaGlobeEurope,
  [Region.Asia]: FaGlobeAsia,
  [Region.Africa]: FaGlobeAfrica,
};

export enum Currency {
  USD = "USD",
  EUR = "EUR",
}
export const CurrencyIconMapping = {
  [Currency.USD]: BsCurrencyDollar,
  [Currency.EUR]: BsCurrencyEuro,
};

interface SiteConfigContextProps {
  language: string;
  region: Region;
  currency: Currency;
  setLanguage: (language: string) => void;
  setRegion: (region: Region) => void;
  setCurrency: (currency: Currency) => void;
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>("en");
  const [region, setRegion] = useState<Region>(Region.America);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);

  return (
    <SiteConfigContext.Provider value={{ language, region, currency, setLanguage, setRegion, setCurrency }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
};
