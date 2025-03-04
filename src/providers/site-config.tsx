/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from "react";
import { Currency, Region } from "../types";

interface SiteConfigContextProps {
  navHeight: number;
  language: string;
  region: Region;
  currency: Currency;
  setNavHeight: (height: number) => void;
  setLanguage: (language: string) => void;
  setRegion: (region: Region) => void;
  setCurrency: (currency: Currency) => void;
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>("en");
  const [region, setRegion] = useState<Region>(Region.America);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [navHeight, setNavHeight] = useState<number>(0);

  return (
    <SiteConfigContext.Provider
      value={{ navHeight, language, region, currency, setNavHeight, setLanguage, setRegion, setCurrency }}
    >
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
