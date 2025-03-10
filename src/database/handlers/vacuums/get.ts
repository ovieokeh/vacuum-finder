import { supabase } from "../..";

export const getVacuum = async (vacuumId: string) => {
  const { data: vacuum, error } = await supabase
    .from("Vacuums")
    .select(
      `
    *,
    affiliateLinks:AffiliateLinks (*)
  `
    )
    .eq("id", vacuumId)
    .single();

  if (error) {
    throw error;
  }

  if (!vacuum) {
    return null;
  }

  return vacuum;
};
