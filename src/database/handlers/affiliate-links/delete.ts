import { supabase } from "../..";

export const deleteVacuumHandler = async (id: string) => {
  const { error } = await supabase.from("AffiliateLinks").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
};
