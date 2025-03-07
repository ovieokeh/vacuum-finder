import {
  // useEffect,
  useState,
} from "react";
import { Region } from "../types";

interface UserLocation {
  language: string;
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
  const [userLocation] = useState<UserLocation>(() => {
    if (typeof window === "undefined") {
      return { language: "en", country_code: "US", country_name: "United States" };
    }

    const userLanguage = navigator.language.split("-")[0];
    const userCountry = navigator.language.split("-")[1];

    return { language: userLanguage, country: userCountry };
  });

  // const getLocationByIP = async () => {
  //   try {
  //     const url = `/api/geolocate`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     setUserLocation(data);
  //   } catch (error) {
  //     console.error("Failed to fetch user location by IP", error);
  //   }
  // };

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     getLocationByIP();
  //   }
  // }, []);

  const region = userLocation.time_zone?.split("/")[0] || "America";
  const typedRegion = (Region[region as keyof typeof Region] as Region) || Region.America;

  return {
    ...userLocation,
    region: typedRegion,
  };
};
