// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSolutions,
  fetchSolution,
  createSolution,
  updateSolution,
  deleteSolution,
} from "@/services/solution-service";

export const useSolutions = (searchParams = "") => {
  return useQuery({
    queryKey: ["solutions", searchParams],
    queryFn: () => fetchSolutions(searchParams),
  });
};

export const useSolution = (id) => {
  return useQuery({
    queryKey: ["solutions", id],
    queryFn: () => fetchSolution(id),
    enabled: !!id,
  });
};

export const useCreateSolution = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSolution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      callback?.();
    },
  });
};

export const useUpdateSolution = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => updateSolution(id, product),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      callback?.();
    },
  });
};

export const useDeleteSolution = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteSolution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solutions"] });
      callback?.();
    },
  });
};
