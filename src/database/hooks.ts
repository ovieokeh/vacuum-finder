import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { VacuumsFilters } from "../types";
import { searchVacuums } from "./handlers/vacuums/search";
import { listVacuumBrands } from "./handlers/vacuums/list-brands";
import { addVacuum } from "./handlers/vacuums/admin/create";
import { deleteVacuum } from "./handlers/vacuums/admin/delete";
import { updateVacuum } from "./handlers/vacuums/admin/update";
import { getVacuum } from "./handlers/vacuums/get";

export const useGetVacuum = (id: string) => {
  return useQuery({
    queryKey: ["get-vacuum", id],
    queryFn: () => getVacuum(id),
    enabled: true,
  });
};

export const useSearchVacuums = (filters: VacuumsFilters) => {
  return useQuery({
    queryKey: ["search-vacuums"],
    queryFn: () => searchVacuums({ filters, page: 1, limit: 10 }),
    enabled: true,
  });
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
      queryClient.invalidateQueries({ queryKey: ["search-vacuums"] });
      if (data && args.onSuccess) args.onSuccess();
    },
  });
};

export const useDeleteVacuum = (args: { onSuccess?: () => void } = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-vacuum"],
    mutationFn: deleteVacuum,
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ["search-vacuums"] });
      queryClient.invalidateQueries({ queryKey: ["get-vacuum"] });
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
