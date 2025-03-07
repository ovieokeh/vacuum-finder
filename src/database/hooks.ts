import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Vacuum, VacuumsFilter } from "../types";

export function useVacuumsQuery() {
  const vacuumsQuery = useQuery<Vacuum[]>({
    queryKey: ["vacuums"],
    queryFn: async () => {
      const response = await fetch("/api/vacuums");
      if (!response.ok) throw new Error("Failed to fetch vacuums");
      return response.json();
    },
  });

  return vacuumsQuery;
}
export function useVacuumQuery(vacuumId: string) {
  const vacuumQuery = useQuery<Vacuum>({
    queryKey: ["vacuums", vacuumId],
    queryFn: async () => {
      const response = await fetch(`/api/vacuums/${vacuumId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vacuum");
      }
      return response.json();
    },
    enabled: Boolean(vacuumId),
    throwOnError: (error) => {
      if (error.message === "Failed to fetch vacuum") {
        return false;
      }
      return true;
    },
  });

  return vacuumQuery;
}
export function useAddVacuumMutation({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const addVacuumMutation = useMutation<Vacuum, Error, Partial<Vacuum> & { userToken?: string }>({
    mutationFn: async (data) => {
      const response = await fetch("/api/vacuums", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: data.userToken ?? "" },
        body: JSON.stringify({
          ...data,
          userToken: undefined,
        }),
      });
      if (!response.ok) throw new Error("Failed to add vacuum");
      return response.json();
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
    },
  });

  return addVacuumMutation;
}
export function useUpdateVacuumMutation({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const updateVacuumMutation = useMutation<Vacuum, Error, { id: string; data: Partial<Vacuum>; userToken?: string }>({
    mutationFn: async ({ id, data, userToken }) => {
      const response = await fetch(`/api/vacuums/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: userToken ?? "" },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) throw new Error("Failed to update vacuum");
      return response.json();
    },
    onSuccess: (vacuum) => {
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
      queryClient.invalidateQueries({ queryKey: ["user-vacuums"] });

      if (vacuum.id) {
        queryClient.invalidateQueries({ queryKey: ["vacuums", vacuum.id] });
      }

      onSuccess?.();
    },
  });

  return updateVacuumMutation;
}
export function useDeleteVacuumMutation({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const deleteVacuumMutation = useMutation<
    { message: string },
    Error,
    {
      id: string;
      userToken?: string;
    }
  >({
    mutationFn: async ({ id, userToken }) => {
      const response = await fetch(`/api/vacuums/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: userToken ?? "" },
      });
      if (!response.ok) throw new Error("Failed to delete vacuum");
      return response.json();
    },
    onSuccess: (_data, { id }) => {
      queryClient.removeQueries({ queryKey: ["vacuums", id] });
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
      queryClient.invalidateQueries({ queryKey: ["user-vacuums"] });
      onSuccess?.();
    },
  });

  return deleteVacuumMutation;
}
export function useFilterVacuumsMutation({ onSuccess }: { onSuccess?: () => void }) {
  const filterVacuumsMutation = useMutation<Vacuum[], Error, VacuumsFilter>({
    mutationFn: async (filterData: VacuumsFilter) => {
      const response = await fetch("/api/search-vacuums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterData),
      });
      if (!response.ok) throw new Error("Failed to filter vacuums");
      return response.json();
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
  return filterVacuumsMutation;
}
