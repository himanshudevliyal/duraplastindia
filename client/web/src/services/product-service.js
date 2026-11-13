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

// country: "India" / "Global" ... => that country's content / SEO.
// Returns null when the slug does not exist.
// lang: a language version (e.g. "fr"); null when it does not exist (404)
export const fetchBlogBySlug = async (slug, country, lang) => {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (lang) params.set("lang", lang);
  const query = params.size ? `?${params}` : "";
  try {
    const { data } = await http().get(
      `${endpoints.blogs.getAll}/get-by-slug/${encodeURIComponent(slug)}${query}`,
    );
    return data;
  } catch (error) {
    // unknown slug => null => the page shows 404 (not a server error)
    if (error?.response?.status === 404) return null;
    throw error;
  }
};
