// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSolutions,
  fetchSolution,
  createSolution,
  updateSolution,
  deleteSolution,
  fetchSolutionBySlug,
} from "@/services/solution-service";

export const useSolutions = (searchParams = "") => {
  return useQuery({
    queryKey: ["solutions", searchParams],
    queryFn: () => fetchSolutions(searchParams),
  });
};

export const useSolution = (slug) => {
  return useQuery({
    queryKey: ["solutions", slug],
    queryFn: () => fetchSolution(slug),
    enabled: !!slug,
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

export const useSolutionBySlug = (slug) => {
  return useQuery({
    queryKey: ["solution", slug],

    queryFn: () => fetchSolutionBySlug(slug),

    enabled: !!slug,
  });
};
