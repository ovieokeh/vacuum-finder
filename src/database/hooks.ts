import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Vacuum, VacuumsFilter } from "../types";

export function useDatabase(vacuumId?: number) {
  const queryClient = useQueryClient();
  // Fetch all vacuums.
  const vacuumsQuery = useQuery<Vacuum[]>({
    queryKey: ["vacuums"],
    queryFn: async () => {
      const response = await fetch("/api/vacuums");
      if (!response.ok) throw new Error("Failed to fetch vacuums");
      return response.json();
    },
  });

  // Fetch a single vacuum by id.
  // This query is always called, but disabled if no vacuumId is provided.
  const vacuumQuery = useQuery<Vacuum>({
    queryKey: ["vacuums", vacuumId],
    queryFn: async () => {
      const response = await fetch(`/api/vacuums/${vacuumId}`);
      if (!response.ok) throw new Error("Failed to fetch vacuum");
      return response.json();
    },
    enabled: Boolean(vacuumId),
  });

  // Filter vacuums based on user preferences.
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
  });
  const addVacuumMutation = useMutation<Vacuum, Error, Vacuum>({
    mutationFn: async (newVacuum: Vacuum) => {
      const response = await fetch("/api/vacuums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVacuum),
      });
      if (!response.ok) throw new Error("Failed to add vacuum");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
    },
  });

  // Mutation: update an existing vacuum.
  // Expects an object with vacuum id and a partial update payload.
  const updateVacuumMutation = useMutation<Vacuum, Error, { id: string; data: Partial<Vacuum> }>({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/vacuums/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update vacuum");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
      if (vacuumId) {
        queryClient.invalidateQueries({ queryKey: ["vacuums", vacuumId] });
      }
    },
  });

  // Mutation: delete a vacuum.
  const deleteVacuumMutation = useMutation<{ message: string }, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/vacuums/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vacuum");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacuums"] });
    },
  });

  return {
    vacuumsQuery,
    vacuumQuery,
    filterVacuumsMutation,
    addVacuumMutation,
    updateVacuumMutation,
    deleteVacuumMutation,
  };
}
