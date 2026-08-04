import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  fetchCategoryRelatedProducts,
  updateCategory,
} from "@/services/category-service";
import { useLocale } from "next-intl";
import { getCountryFromLocale } from "@/utils/country-mapping";

export const useCategories = (searchParams = "") => {
  return useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => fetchCategories(searchParams),
  });
};
export const useFormattedCategories = (searchParams = "") => {
  return useQuery({
    queryKey: ["categories", searchParams],
    queryFn: () => fetchCategories(searchParams),
    select: ({ categories }) => {
      return categories?.map((b) => ({
        value: b.id,
        label: b.title,
      }));
    },
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
};

export const useCategoryRelatedProducts = (
  id,
  searchParams = "",
  options = {},
) => {
  const locale = useLocale();
  const currentCountry = getCountryFromLocale(locale);

  return useQuery({
    queryKey: ["category-related-products", id, searchParams, currentCountry],
    queryFn: () => fetchCategoryRelatedProducts(id, searchParams),
    enabled: !!id,
    select: (data) => ({
      ...data,
      products:
        data?.products?.filter((product) =>
          Array.isArray(product.city)
            ? product.city.includes(currentCountry)
            : false,
        ) ?? [],
    }),
    ...options,
  });
};

export const useCreateCategory = (callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      callback?.();
    },
  });
};

export const useUpdateCategory = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["categories", id],
    mutationFn: (data) => updateCategory(id, data),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      callback?.();
    },
  });
};

export const useDeleteCategory = (id, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["categories", id],
    mutationFn: () => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      callback?.();
    },
  });
};
