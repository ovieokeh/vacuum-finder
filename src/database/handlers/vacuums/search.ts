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
  filters: VacuumsFilters;
  page: number;
  limit: number;
}): Promise<VacuumsSearchResult> => {
  const { model, brand } = filters;
  const offset = (page - 1) * limit;

  const supabaseQuery = supabase.from("Vacuums").select(`
    *,
    affiliateLinks:AffiliateLinks (*)
  `);
  if (model) supabaseQuery.eq("model", model);
  if (brand) supabaseQuery.eq("brand", brand);

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
