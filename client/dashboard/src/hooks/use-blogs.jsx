// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlogs,
  fetchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/product-service";

export const useBlogs = (searchParams = "") => {
  return useQuery({
    queryKey: ["blogs", searchParams],
    queryFn: () => fetchBlogs(searchParams),
  });
};

export const useBlog = (id) => {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => fetchBlog(id),
    enabled: !!id,
  });
};

export const useCreateBlog = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      callback?.();
    },
  });
};

export const useUpdateBlog = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => updateBlog(id, product),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      callback?.();
    },
  });
};

export const useDeleteBlog = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      callback?.();
    },
  });
};
