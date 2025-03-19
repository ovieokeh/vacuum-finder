import { useEffect, useState } from "react";

import { useIsClient } from "./use-is-client";
import { Region } from "../database";

interface UserLocation {
  locale: string;
  region: Region;
  ip?: string;
  country_code?: string;
  country_name?: string;
  time_zone?: string;
}

export const useUserLocation = () => {
  const isClient = useIsClient();
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    if (!isClient) {
      return { locale: "en-US", country_code: "US", country_name: "United States", region: "americas" };
    }

    const userCountry = navigator.language.split("-")[1];

    return { locale: navigator.language, country: userCountry, region: "americas" };
  });

  const getLocationByIP = async () => {
    try {
      const url = `/api/geolocate`;
      const response = await fetch(url);
      const data = await response.json();
      setUserLocation(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      // do nothing
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getLocationByIP();
    }
  }, []);

  return {
    ...userLocation,
  };
};
