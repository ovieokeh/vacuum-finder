/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Currency, Region } from "../types";
import { useUserLocation } from "../hooks/use-user-location";
import { createClient, User } from "@supabase/supabase-js";

export const supabaseFrontend = createClient(
  "https://cevxzvsqlweccdszjadm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnh6dnNxbHdlY2Nkc3pqYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzA1NjksImV4cCI6MjA1Njg0NjU2OX0.hdzjvJu1pekfhZbFI4rdvWqZi6llKsc9cNAkglkqToI"
);

interface SiteConfigContextProps {
  user: User | undefined;
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
  const [currency, setCurrency] = useState<Currency>(() => (region === Region.Europe ? Currency.EUR : Currency.USD));
  const [navHeight, setNavHeight] = useState<number>(0);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    // sync user from local storage
    supabaseFrontend.auth.getSession().then(({ data, error }) => {
      if (error || !data) {
        console.error("Error getting user:", error?.message);
        return;
      }

      const { session } = data;

      setUser(session?.user);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabaseFrontend.auth.signInWithPassword({ email, password });

    if (error || !data) {
      console.error("Error signing in:", error?.message);
      return { error: error?.message };
    }

    setUser(data.session.user);
    return undefined;
  };

  const logout = async () => {
    await supabaseFrontend.auth.signOut();
    setUser(undefined);
  };

  useEffect(() => {
    setLanguage(userLanguage);
  }, [userLanguage]);
  useEffect(() => {
    setRegion(userRegion);
    setCurrency(userRegion === Region.Europe ? Currency.EUR : Currency.USD);
  }, [userRegion]);

  return (
    <SiteConfigContext.Provider
      value={{
        user,
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
