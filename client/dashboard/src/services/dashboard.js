import http from "@/utils/http";
import axios from "axios";
export const fetchDashboardStats = async () => {
  const res = await http().get("/dashboard/stats");
  return res.data;
};

export const fetchBlogsByCategory = async () => {
  const res = await http().get("/dashboard/blogs-by-category");
  return res.data;
};

export const fetchProductsByCategory = async () => {
  const res = await http().get("/dashboard/products-by-category");
  return res.data;
};

export const fetchPartnersByRegion = async () => {
  const res = await http().get("/dashboard/partners-by-region");
  return res.data;
};

export const fetchContentGrowth = async (months = 12) => {
  const res = await http().get(`/dashboard/content-growth?months=${months}`);
  return res.data;
};

export const fetchRecentBlogs = async (limit = 5) => {
  const res = await http().get(`/dashboard/recent-blogs?limit=${limit}`);
  return res.data;
};

export const fetchUsersByRole = async () => {
  const res = await http().get("/dashboard/users-by-role");
  return res.data;
};
