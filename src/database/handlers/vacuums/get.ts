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

  const hasEmptyOtherFeatures = vacuum.otherFeatures?.length === 1 && vacuum.otherFeatures[0] === "";
  if (hasEmptyOtherFeatures) {
    vacuum.otherFeatures = [];
  }

  return vacuum;
};
