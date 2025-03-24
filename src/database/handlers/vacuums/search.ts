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
    numPets: (query, value) => (value ? query.gte("suctionPowerInPascals", 2000 * (value ?? 0)) : query),
    batteryLifeInMinutes: (query, value) => (value ? query.gte("batteryLifeInMinutes", value) : query),
    suctionPowerInPascals: (query, value) => (value ? query.gte("suctionPowerInPascals", value) : query),
    noiseLevelInDecibels: (query, value) =>
      value ? query.or(`noiseLevelInDecibels.is.null,noiseLevelInDecibels.lte.${value}`) : query,
    waterTankCapacityInLiters: (query, value) => (value ? query.gte("waterTankCapacityInLiters", value) : query),
    dustbinCapacityInLiters: (query, value) => (value ? query.gte("dustbinCapacityInLiters", value) : query),
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
  filters: Partial<VacuumsFilters> & {
    model?: string;
    owned?: boolean;
    budget?: number;
    currency?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  page: number;
  limit: number;
}): Promise<VacuumsSearchResult> => {
  const { data: userSession } = await supabase.auth.getSession();
  const { owned, budget, currency, model, sortBy, sortOrder, ...rest } = filters;
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

  // Define mapping from sortBy values to actual database column names
  const sortMapping: { [key: string]: string } = {
    price: "min_price",
    batteryLife: "batteryLifeInMinutes",
    suctionPower: "suctionPowerInPascals",
    noiseLevel: "noiseLevelInDecibels",
    waterTankCapacity: "waterTankCapacityInLiters",
    dustbinCapacity: "dustbinCapacityInLiters",
  };

  // Apply sorting if sortBy is provided and valid
  if (sortBy && sortMapping[sortBy]) {
    // Use ascending order if sortOrder is 'asc', otherwise descending
    supabaseQuery.order(sortMapping[sortBy], { ascending: sortOrder === "asc", nullsFirst: false });
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
