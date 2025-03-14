import { VacuumsWithAffiliateLinks, supabase } from "../..";
import { VacuumsFilters } from "../../../types";

export interface VacuumsSearchResult {
  results: VacuumsWithAffiliateLinks;
  page: number;
  limit: number;
  total: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseSupabaseQuery = supabase.from("vacuumaffiliatesummary").select(`
  *,
  affiliateLinks:AffiliateLinks (
    *
  )
  `);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const baseMatchCountQuery = supabase.from("vacuumaffiliatesummary").select("id", { count: "exact" });

const applyFiltersToQuery = (
  query: typeof baseSupabaseQuery | typeof baseMatchCountQuery,
  filters: Partial<VacuumsFilters>
) => {
  const booleanFilterTransform = (key: keyof VacuumsFilters) => (query: any, value: boolean) => query.eq(key, value);
  const SPECIAL_TRANSFORMS: {
    [key in keyof VacuumsFilters]?: (q: typeof query, v: any) => typeof query;
  } = {
    brand: (query, value) => query.ilike("brand", `%${value}%`),
    mappingTechnology: (query, value) => query.eq("mappingTechnology", value),
    numPets: (query, value) => query.gte("suctionPowerInPascals", 2000 * (value ?? 0)),
    batteryLifeInMinutes: (query, value) => query.gte("batteryLifeInMinutes", value),
    suctionPowerInPascals: (query, value) => query.gte("suctionPowerInPascals", value),
    noiseLevelInDecibels: (query, value) => query.lte("noiseLevelInDecibels", value),
    waterTankCapacityInLiters: (query, value) => query.gte("waterTankCapacityInLiters", value),
    dustbinCapacityInLiters: (query, value) => query.gte("dustbinCapacityInLiters", value),
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (key in SPECIAL_TRANSFORMS) {
      SPECIAL_TRANSFORMS[key as keyof VacuumsFilters]!(query, value);
    } else if (typeof value === "boolean") {
      booleanFilterTransform(key as keyof VacuumsFilters)(query, value);
    }
  });

  return query;
};

export const searchVacuums = async ({
  filters,
  page,
  limit,
}: {
  filters: Partial<VacuumsFilters> & { model?: string; owned?: boolean; budget?: number; currency?: string };
  page: number;
  limit: number;
}): Promise<VacuumsSearchResult> => {
  const { data: userSession } = await supabase.auth.getSession();
  const { owned, budget, currency, model, ...rest } = filters;
  const offset = (page - 1) * limit;

  const userEmail = userSession?.session?.user?.email;
  if (owned && !userEmail) {
    throw new Error("User must be logged in to view owned vacuums");
  }

  // Use the view for querying, which includes aggregated affiliate link data.
  const supabaseQuery = supabase.from("vacuumaffiliatesummary").select(`  *,
  affiliateLinks:AffiliateLinks (
    *
  )`);
  const matchCountQuery = supabase.from("vacuumaffiliatesummary").select("id", { count: "exact" });

  if (owned) {
    supabaseQuery.eq("userEmail", userEmail!);
    matchCountQuery.eq("userEmail", userEmail!);
  }
  if (model) {
    supabaseQuery.ilike("model", `%${model}%`);
    matchCountQuery.ilike("model", `%${model}%`);
  }

  applyFiltersToQuery(supabaseQuery, rest);
  applyFiltersToQuery(matchCountQuery, rest);

  if (budget) {
    if (!currency) {
      throw new Error("Currency must be provided when filtering by budget");
    }
    // The filter returns rows where either:
    // 1. There is no affiliate link data (min_price is null),
    // OR
    // 2. The aggregated affiliate link has a matching currency and a min_price <= budget.
    supabaseQuery.or(`min_price.is.null,and(currency.eq.${currency},min_price.lte.${budget})`);
    matchCountQuery.or(`min_price.is.null,and(currency.eq.${currency},min_price.lte.${budget})`);
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
    results: data as VacuumsWithAffiliateLinks,
    page,
    limit,
    total: total as number,
  };
};
