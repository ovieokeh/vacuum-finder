import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { VacuumsFilters } from "../types";
import { searchVacuums } from "./handlers/vacuums/search";
import { listVacuumBrands } from "./handlers/vacuums/list-brands";
import { addVacuum } from "./handlers/vacuums/admin/create";
import { deleteVacuum } from "./handlers/vacuums/admin/delete";
import { updateVacuum } from "./handlers/vacuums/admin/update";
import { getVacuum } from "./handlers/vacuums/get";
import { listCountries } from "./handlers/vacuums/list-countries";

export const useGetVacuum = (id?: string) => {
  return useQuery({
    queryKey: ["get-vacuum", id],
    queryFn: () => getVacuum(id ?? ""),
    enabled: !!id,
  });
};

interface UseSearchVacuumsArgs {
  filters: Partial<VacuumsFilters>;
  sorting?: {
    key: string;
    direction: "asc" | "desc";
  };
  owned?: boolean;
  page?: number;
  limit?: number;
  enabled?: boolean;
}
export const useSearchVacuums = ({ filters, owned, page = 1, limit = 10, enabled = true }: UseSearchVacuumsArgs) => {
  const stringifiedFilters = JSON.stringify(filters);
  const query = useQuery({
    queryKey: ["search-vacuums", stringifiedFilters, owned, page],
    queryFn: () =>
      searchVacuums({
        filters: {
          ...filters,
          owned,
        },
        page,
        limit,
      }),
    placeholderData: keepPreviousData,
    enabled,
  });

  return query;
};

export const useSearchVacuumsInfinite = ({ filters, sorting, owned, page = 0, limit = 10 }: UseSearchVacuumsArgs) => {
  const stringifiedFilters = JSON.stringify(filters);
  const stringifiedSorting = `${sorting?.key}-${sorting?.direction}`;
  const query = useInfiniteQuery({
    queryKey: ["search-vacuums", stringifiedFilters, stringifiedSorting, owned],
    queryFn: (context) =>
      searchVacuums({
        filters: {
          ...filters,
          owned,
          sortBy: sorting?.key,
          sortOrder: sorting?.direction,
        },
        page: context.pageParam ?? page,
        limit,
      }),
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      if (lastPage.results.length < limit) {
        return undefined;
      }
      return lastPage.page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage.page === 1) {
        return undefined;
      }
      return firstPage.page - 1;
    },

    enabled: true,
  });

  return query;
};

export const useInfiniteQueryFetcher = (fetchNextPage: () => void) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return { ref };
};

export const useAddVacuum = (args: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-vacuum"],
    mutationFn: addVacuum,
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["search-vacuums"] });
      if (data && args.onSuccess) args.onSuccess();
    },
  });
};

export const useUpdateVacuum = (args: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-vacuum"],
    mutationFn: updateVacuum,
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["search-vacuums"] });
        queryClient.invalidateQueries({ queryKey: ["get-vacuum", data.id] });
        if (args.onSuccess) args.onSuccess();
      }
    },
  });
};

export const useDeleteVacuum = (args: { onSuccess?: () => void } = {}) => {
  return useMutation({
    mutationKey: ["delete-vacuum"],
    mutationFn: deleteVacuum,
    onSettled: (data) => {
      if (data && args.onSuccess) args.onSuccess();
    },
  });
};

export const useListBrands = () => {
  return useQuery({
    queryKey: ["list-brands"],
    queryFn: () => listVacuumBrands(),
    enabled: true,
  });
};
export const useListCountries = () => {
  return useQuery({
    queryKey: ["list-countries"],
    queryFn: () => listCountries(),
    enabled: true,
  });
};
