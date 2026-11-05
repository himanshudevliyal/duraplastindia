import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchProductPages = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.productPages.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchProductPage = async (id) => {
  const { data } = await http().get(`${endpoints.productPages.getAll}/${id}`);
  return data;
};

// country: "India" / "Global" ... => that country's content / SEO.
// Returns null when the slug does not exist.
export const fetchProductPageBySlug = async (slug, country) => {
  const query = country ? `?country=${encodeURIComponent(country)}` : "";
  try {
    const { data } = await http().get(
      `${endpoints.productPages.getAll}/get-by-slug/${encodeURIComponent(slug)}${query}`,
    );
    return data;
  } catch (error) {
    // unknown slug => null => the page shows 404 (not a server error)
    if (error?.response?.status === 404) return null;
    throw error;
  }
};

export const createProductPage = async (blog) => {
  const { data } = await http().post(endpoints.productPages.getAll, blog, true);
  return data;
};

export const updateProductPage = async (id, blog) => {
  const { data } = await http().put(
    `${endpoints.productPages.getAll}/${id}`,
    blog,
    true,
  );
  return data;
};

export const deleteProductPage = async (id) => {
  return await http().delete(`${endpoints.productPages.getAll}/${id}`);
};
