import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductPage,
  deleteProductPage,
  fetchProductPage,
  fetchProductPages,
  updateProductPage,
} from "@/services/product-page-services";

export const useProductPages = (searchParams = "") => {
  return useQuery({
    queryKey: ["product-pages", searchParams],
    queryFn: () => fetchProductPages(searchParams),
  });
};

export const useFormattedProductPages = (searchParams = "") => {
  return useQuery({
    queryKey: ["product-pages", searchParams],
    queryFn: () => fetchProductPages(searchParams),
    select: ({ products }) => {
      return (
        products?.map(({ id: value, title: label }) => ({ value, label })) ?? []
      );
    },
  });
};

export const useProductPage = (id) => {
  return useQuery({
    queryKey: ["product-pages", id],
    queryFn: () => fetchProductPage(id),
    enabled: !!id,
  });
};

export const useCreateProductPage = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-pages"] });
      callback?.();
    },
  });
};

export const useUpdateProductPage = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => updateProductPage(id, product),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["product-pages"] });
      callback?.();
    },
  });
};

export const useDeleteProductPage = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteProductPage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-pages"] });
      callback?.();
    },
  });
};
