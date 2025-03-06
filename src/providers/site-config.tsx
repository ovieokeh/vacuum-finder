/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Currency, Region } from "../types";
import { useUserLocation } from "../hooks/use-user-location";

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
  const { region: userRegion, language: userLanguage } = useUserLocation();
  const [language, setLanguage] = useState<string>(() => userLanguage);
  const [region, setRegion] = useState<Region>(() => userRegion);
  const [currency, setCurrency] = useState<Currency>(() => (region === Region.Europe ? Currency.EUR : Currency.USD));
  const [navHeight, setNavHeight] = useState<number>(0);

  useEffect(() => {
    setLanguage(userLanguage);
  }, [userLanguage]);
  useEffect(() => {
    setRegion(userRegion);
    setCurrency(userRegion === Region.Europe ? Currency.EUR : Currency.USD);
  }, [userRegion]);

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
