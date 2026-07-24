import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCityBlog,
  deleteCityBlog,
  fetchCityBlog,
  fetchCityBlogs,
  updateCityBlog,
} from "@/services/city-blog";

export const useCityBlogs = (searchParams = "") => {
  return useQuery({
    queryKey: ["city-blogs", searchParams],
    queryFn: () => fetchCityBlogs(searchParams),
  });
};

export const useCityBlog = (id) => {
  return useQuery({
    queryKey: ["city-blogs", id],
    queryFn: () => fetchCityBlog(id),
    enabled: !!id,
  });
};

export const useCreateCityBlog = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCityBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-blogs"] });
      callback?.();
    },
  });
};

export const useUpdateCityBlog = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => updateCityBlog(id, product),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["city-blogs"] });
      callback?.();
    },
  });
};

export const useDeleteCityBlog = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteCityBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["city-blogs"] });
      callback?.();
    },
  });
};
