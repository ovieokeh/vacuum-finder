import { VacuumsWithAffiliateLinks, supabase } from "../..";
import { VacuumsFilters } from "../../../types";

export interface VacuumsSearchResult {
  results: VacuumsWithAffiliateLinks;
  page: number;
  limit: number;
}
export const searchVacuums = async ({
  filters,
  page,
  limit,
}: {
  filters: VacuumsFilters & { owned?: boolean };
  page: number;
  limit: number;
}): Promise<VacuumsSearchResult> => {
  const { data: userSession } = await supabase.auth.getSession();
  const { model, brand, owned } = filters;
  const offset = (page - 1) * limit;

  const userEmail = userSession?.session?.user?.email;
  if (owned && !userEmail) {
    throw new Error("User must be logged in to view owned vacuums");
  }

  const supabaseQuery = supabase.from("Vacuums").select(`
    *,
    affiliateLinks:AffiliateLinks (*)
  `);
  if (model) supabaseQuery.eq("model", model);
  if (brand) supabaseQuery.eq("brand", brand);
  if (owned) supabaseQuery.eq("userEmail", userEmail!);

  const { data, error } = await supabaseQuery.range(offset, offset + limit - 1).limit(limit);

  if (error) {
    throw error;
  }

  return {
    results: data,
    page,
    limit,
  };
};
