import { useEffect, useState } from "react";
import { Region } from "../types";
import { useIsClient } from "./use-is-client";

interface UserLocation {
  language: string;
  region: Region;
  ip?: string;
  country_code?: string;
  country_name?: string;
  time_zone?: string;
  // {
  //   "ip": "31.20.1.250",
  //   "country_code": "NL",
  //   "country_name": "Netherlands",
  //   "region_code": "NL-ZH",
  //   "region_name": "South Holland",
  //   "city": "The Hague",
  //   "zip_code": "2590",
  //   "time_zone": "Europe/Amsterdam",
  //   "latitude": 52.0766487121582,
  //   "longitude": 4.298633098602295,
  //   "metro_code": 0
  // }
}

export const useUserLocation = () => {
  const isClient = useIsClient();
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    if (!isClient) {
      return { language: "en", country_code: "US", country_name: "United States", region: Region.America };
    }

    const userLanguage = navigator.language.split("-")[0];
    const userCountry = navigator.language.split("-")[1];

    return { language: userLanguage, country: userCountry, region: Region.America };
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
