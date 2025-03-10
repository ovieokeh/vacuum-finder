import { supabase } from "../../..";

export const deleteVacuum = async (id: string) => {
  const { error } = await supabase.from("Vacuums").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return { message: "Vacuum deleted successfully." };
};
