import { useQuery } from "@tanstack/react-query";

import { Region } from "../database/types";

interface UserLocation {
  locale: string;
  region: Region;
  ip?: string;
  countryCode?: string;
  country_name?: string;
  time_zone?: string;
}

export const useUserLocation = () => {
  const userLocationQuery = useQuery({
    queryKey: ["user-location"],
    queryFn: async () => {
      const response = await fetch("/api/geolocate");
      const data = await response.json();
      return data;
    },
  });

  const data = (userLocationQuery.data as UserLocation) ?? {
    locale: "en-US",
    region: "americas",
    countryCode: "us",
  };

  return {
    ...data,
    isLoaded: userLocationQuery.isFetched,
  };
};
