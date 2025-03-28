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
  locale: string;
  region: Region;
  countryCode: string | undefined;
  currency: Currency;
  setNavHeight: (height: number) => void;
  setLocale: (locale: string) => void;
  setRegion: (region: Region) => void;
  setCurrency: (currency: Currency) => void;
  login: (email: string, password: string) => Promise<{ error: string | undefined } | undefined>;
  logout: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextProps | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const userLocationData = useUserLocation();
  const { isLoaded: isUserlocationLoaded, locale: userLocale, region: userRegion, countryCode } = userLocationData;
  const [locale, setLocale] = useState<string>(() => userLocale);
  const [region, setRegion] = useState<Region>(() => userRegion);
  const [currency, setCurrency] = useState<Currency>(() =>
    region === "europe"
      ? "eur"
      : region === "americas"
      ? "usd"
      : region === "africa"
      ? "zar"
      : region === "australia"
      ? "aud"
      : "usd"
  );
  const [navHeight, setNavHeight] = useState<number>(0);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   if (userLocale) {
  //     setLocale(userLocale);
  //   }

  //   if (userRegion) {
  //     setRegion(userRegion);
  //     setCurrency(userRegion === "europe" ? "eur" : "usd");
  //   }

  //   if (userCountry) {
  //     setCountryCode(userCountry);
  //   }
  // }, [userLocale, userRegion, userCountry]);

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
    if (userLocale) {
      setLocale(userLocale);
    }

    if (userRegion) {
      setRegion(userRegion);
      setCurrency(
        userRegion === "europe"
          ? "eur"
          : userRegion === "americas"
          ? "usd"
          : userRegion === "africa"
          ? "zar"
          : userRegion === "australia"
          ? "aud"
          : "usd"
      );
    }
  }, [userLocale, userRegion]);

  if (!isUserlocationLoaded || !isLoaded) {
    return null;
  }

  return (
    <SiteConfigContext.Provider
      value={{
        isLoaded,
        user,
        userToken,
        navHeight,
        locale,
        countryCode,
        region,
        currency,
        setNavHeight,
        setLocale,
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
