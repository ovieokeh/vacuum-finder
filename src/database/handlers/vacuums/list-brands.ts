import { supabase } from "../..";

export const listVacuumBrands = async () => {
  const brands = await supabase.from("Vacuums").select("brand").order("brand", { ascending: true });

  const brandsArray = brands.data?.map((brand) => brand.brand) ?? [];
  const uniqueBrands = Array.from(new Set(brandsArray));

  return uniqueBrands;
};
