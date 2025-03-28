import enCountries from "./countries";
export const countryCodeToReadable = (countryCode: string) => {
  // dynamically import country codes
  const typedCountries = enCountries.countries as Record<string, any>;
  const country = typedCountries[countryCode.toUpperCase()];
  return country;
};
