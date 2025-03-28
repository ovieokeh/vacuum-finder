import { useSearchParams } from "react-router";
import { VacuumsFilters } from "../types";
import { FILTER_KEY_TYPE_MAPPING, initialSearchFiltersState } from "../shared-utils/vacuum-filters";
import { useEffect } from "react";

export const useFiltersParams = () => {
  const [searchParams] = useSearchParams();

  const filters: VacuumsFilters = (() => {
    const parsed: any = {};
    for (const key in initialSearchFiltersState) {
      const typedKey = key as keyof VacuumsFilters;
      const type = FILTER_KEY_TYPE_MAPPING[typedKey];
      if (!type) continue;

      const value = searchParams.get(typedKey);
      if (value == null) continue;
      if (type === "number") {
        parsed[typedKey] = parseInt(value, 10);
      }
      if (type === "boolean") {
        parsed[typedKey] = value === "true";
      }
      if (type === "string") {
        parsed[typedKey] = value;
      }
      if (type === "null") {
        parsed[typedKey] = value === "null" ? null : value;
      }
    }
    return parsed as VacuumsFilters;
  })();

  return { filters };
};

export const filtersToParamsString = (filters: any) => {
  const definedKeyValues = Object.entries(filters).filter(([, value]) => value != null);
  const newParams = new URLSearchParams();
  for (const [key, value] of definedKeyValues) {
    if (!value) continue;
    newParams.set(key, value.toString());
  }

  return newParams.toString();
};

export const useSyncFiltersToParams = (filters: VacuumsFilters) => {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const definedKeyValues = Object.entries(filters).filter(([, value]) => value != null);
    const newParams = new URLSearchParams();
    for (const [key, value] of definedKeyValues) {
      if (!value) continue;
      newParams.set(key, value.toString());
    }

    setSearchParams(newParams);
  }, [setSearchParams, filters]);
};
