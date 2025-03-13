import { VacuumsWithAffiliateLinks, supabase } from "../..";
import { VacuumsFilters } from "../../../types";

export interface VacuumsSearchResult {
  results: VacuumsWithAffiliateLinks;
  page: number;
  limit: number;
  total: number;
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
  const matchCountQuery = supabase.from("Vacuums").select("id", { count: "exact" });
  if (model) {
    supabaseQuery.ilike("model", `%${model}%`);
    matchCountQuery.ilike("model", `%${model}%`);
  }
  if (brand) {
    supabaseQuery.ilike("brand", `%${brand}%`);
    matchCountQuery.ilike("brand", `%${brand}%`);
  }
  if (owned) {
    supabaseQuery.eq("userEmail", userEmail!);
    matchCountQuery.eq("userEmail", userEmail!);
  }

  const [queryResponse, countQueryResponse] = await Promise.allSettled([
    supabaseQuery.range(offset, offset + limit - 1).limit(limit),
    (await matchCountQuery).count,
  ]);

  if (queryResponse.status === "rejected") {
    throw queryResponse.reason;
  }
  if (countQueryResponse.status === "rejected") {
    throw countQueryResponse.reason;
  }

  const { data, error } = queryResponse.value;
  const total = countQueryResponse.value;

  if (error) {
    throw error;
  }

  return {
    results: data,
    page,
    limit,
    total: total as number,
  };
};
