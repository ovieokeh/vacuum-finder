import { supabase } from "../..";

export const listVacuumBrands = async () => {
  const brands = await supabase.from("Vacuums").select("brand").order("brand", { ascending: true });

  return brands.data?.map((brand) => brand.brand) ?? [];
};
