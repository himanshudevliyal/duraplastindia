import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCustomPages,
  fetchCustomPage,
  createCustomPage,
  updateCustomPage,
  deleteCustomPage,
} from "@/services/custom-page-service";

export const useCustomPages = (searchParams = "") => {
  return useQuery({
    queryKey: ["custom-pages", searchParams],
    queryFn: () => fetchCustomPages(searchParams),
  });
};

export const useCustomPage = (id) => {
  return useQuery({
    queryKey: ["custom-pages", id],
    queryFn: () => fetchCustomPage(id),
    enabled: !!id,
  });
};

export const useCreateCustomPage = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-pages"] });
      callback?.();
    },
  });
};

export const useUpdateCustomPage = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (page) => updateCustomPage(id, page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-pages"] });
      callback?.();
    },
  });
};

export const useDeleteCustomPage = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCustomPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-pages"] });
      callback?.();
    },
  });
};
