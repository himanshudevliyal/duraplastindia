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

export const fetchProductPageBySlug = async (slug) => {
  const { data } = await http().get(
    `${endpoints.productPages.getAll}/get-by-slug/${slug}`,
  );
  return data;
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
