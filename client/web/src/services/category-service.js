import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchCategories = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.categories.getAll}?${searchParams}`,
  );
  return data;
};

// Category page of one site: country = dashboard name ("Global", "India" ...),
// lang = language version code (none = default language). null when the
// category page does not exist there (404).
export const fetchCategoryBySlug = async (slug, country, lang) => {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (lang) params.set("lang", lang);
  try {
    const { data } = await http().get(
      `${endpoints.categories.getAll}/get-by-slug/${encodeURIComponent(slug)}?${params}`,
    );
    return data;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

export const fetchCategory = async (id) => {
  const { data } = await http().get(`${endpoints.categories.getAll}/${id}`);
  return data;
};

export const createCategory = async (data) => {
  const response = await http().post(endpoints.categories.getAll, data, true);
  return response.data;
};

export const updateCategory = async (id, data) => {
  return await http().put(`${endpoints.categories.getAll}/${id}`, data, true);
};

export const deleteCategory = async (id) => {
  return await http().delete(`${endpoints.categories.getAll}/${id}`);
};

export const fetchCategoryRelatedProducts = async (id, searchParams) => {
  const { data } = await http().get(
    `${endpoints.categories.getAll}/${id}/related-products?${searchParams}`,
  );
  return data;
};
