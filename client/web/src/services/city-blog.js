import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchCityBlogs = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.cityBlogs.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchCityBlog = async (id) => {
  const { data } = await http().get(`${endpoints.cityBlogs.getAll}/${id}`);
  return data;
};

export const createCityBlog = async (blog) => {
  const { data } = await http().post(endpoints.cityBlogs.getAll, blog, true);
  return data;
};

export const updateCityBlog = async (id, blog) => {
  const { data } = await http().put(
    `${endpoints.cityBlogs.getAll}/${id}`,
    blog,
    true,
  );
  return data;
};

export const deleteCityBlog = async (id) => {
  return await http().delete(`${endpoints.cityBlogs.getAll}/${id}`);
};
