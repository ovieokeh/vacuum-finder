import { supabase } from "../..";

export const listCountries = async () => {
  const countries = await supabase.rpc("list_countries");

  const countriesArray = countries.data?.map((result) => result) ?? [];

  return countriesArray;
};
