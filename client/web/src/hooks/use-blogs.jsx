// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBlogs,
  fetchBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchBlogBySlug,
} from "@/services/product-service";

export const useBlogs = (searchParams = "") => {
  return useQuery({
    queryKey: ["blogs", searchParams],
    queryFn: () => fetchBlogs(searchParams),
  });
};

export const useBlog = (slug) => {
  return useQuery({
    queryKey: ["blogs", slug],
    queryFn: () => fetchBlog(slug),
    enabled: !!slug,
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

export const useBlogBySlug = (slug) => {
  return useQuery({
    queryKey: ["blog", slug],

    queryFn: () => fetchBlogBySlug(slug),

    enabled: !!slug,
  });
};
