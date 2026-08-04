import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import {
  getCountryFromLocale,
  isProductAvailableInCountry,
} from "@/utils/country-mapping";

export const useCountryFilteredProducts = (searchParams = "") => {
  const locale = useLocale();
  const country = getCountryFromLocale(locale);

  return useQuery({
    queryKey: ["products", "filtered", locale, searchParams],

    queryFn: async () => {
      const response = await http().get(
        `${endpoints.productPages.getAll}?${searchParams}`,
      );

      if (!country) {
        return response.data;
      }

      const filteredProducts = response.data.data.products.filter((product) =>
        isProductAvailableInCountry(product.city, country),
      );

      return {
        ...response.data,
        data: {
          ...response.data.data,
          products: filteredProducts,
          total: filteredProducts.length,
        },
      };
    },

    enabled: !!endpoints.productPages.getAll,
  });
};

// Hook to get formatted products for navigation dropdown
export const useCountryFilteredProductsFormatted = (searchParams = "") => {
  const locale = useLocale();
  const country = getCountryFromLocale(locale);

  return useQuery({
    queryKey: ["products", "filtered-formatted", locale, searchParams],

    queryFn: async () => {
      const response = await http().get(
        `${endpoints.productPages.getAll}?${searchParams}`,
      );

      const products = response.data.data.products || [];

      if (!country) {
        return products.map((p) => ({
          value: p.id,
          label: p.title,
          slug: p.product_page_slug,
        }));
      }

      return products
        .filter((p) => isProductAvailableInCountry(p.city, country))
        .map((p) => ({
          value: p.id,
          label: p.title,
          slug: p.product_page_slug,
        }));
    },
  });
};
