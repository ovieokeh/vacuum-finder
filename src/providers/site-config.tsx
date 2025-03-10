/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUserLocation } from "../hooks/use-user-location";
import { User } from "@supabase/supabase-js";
import { Currency, Region, supabase } from "../database";

interface SiteConfigContextProps {
  isLoaded: boolean;
  user: User | undefined;
  userToken: string | undefined;
  navHeight: number;
  language: string;
  region: Region;
  currency: Currency;
  setNavHeight: (height: number) => void;
  setLanguage: (language: string) => void;
  setRegion: (region: Region) => void;
  setCurrency: (currency: Currency) => void;
  login: (email: string, password: string) => Promise<{ error: string | undefined } | undefined>;
  logout: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const { region: userRegion, language: userLanguage } = useUserLocation();
  const [language, setLanguage] = useState<string>(() => userLanguage);
  const [region, setRegion] = useState<Region>(() => userRegion);
  const [currency, setCurrency] = useState<Currency>(() => (region === "europe" ? "eur" : "usd"));
  const [navHeight, setNavHeight] = useState<number>(0);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // sync user from local storage
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error || !data) {
          setUser(undefined);
          setUserToken(undefined);
          return;
        }

        const { session } = data;

        setUser(session?.user);
        setUserToken(session?.access_token);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data) {
      return { error: error?.message };
    }

    setUser(data.session.user);
    setUserToken(data.session.access_token);
    return undefined;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(undefined);
  };

  useEffect(() => {
    if (userLanguage) {
      setLanguage(userLanguage);
    }

    if (userRegion) {
      setRegion(userRegion);
      setCurrency(userRegion === "europe" ? "eur" : "usd");
    }
  }, [userLanguage, userRegion]);

  return (
    <SiteConfigContext.Provider
      value={{
        isLoaded,
        user,
        userToken,
        navHeight,
        language,
        region,
        currency,
        setNavHeight,
        setLanguage,
        setRegion,
        setCurrency,
        login,
        logout,
      }}
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
