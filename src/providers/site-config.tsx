/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";
import { Currency, Region } from "../types";

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
