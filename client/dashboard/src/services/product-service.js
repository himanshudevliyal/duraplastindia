import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchBlogs = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.blogs.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchBlog = async (id) => {
  const { data } = await http().get(`${endpoints.blogs.getAll}/${id}`);
  return data;
};

export const createBlog = async (blog) => {
  const { data } = await http().post(endpoints.blogs.getAll, blog, true);
  return data;
};

export const updateBlog = async (id, blog) => {
  const { data } = await http().put(
    `${endpoints.blogs.getAll}/${id}`,
    blog,
    true,
  );
  return data;
};

export const deleteBlog = async (id) => {
  return await http().delete(`${endpoints.blogs.getAll}/${id}`);
};
