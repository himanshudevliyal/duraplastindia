import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchBlogsByCategory,
  fetchProductsByCategory,
  fetchPartnersByRegion,
  fetchContentGrowth,
  fetchRecentBlogs,
  fetchUsersByRole,
} from "@/services/dashboard";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });
};

export const useBlogsByCategory = () => {
  return useQuery({
    queryKey: ["dashboard", "blogs-by-category"],
    queryFn: fetchBlogsByCategory,
  });
};

export const useProductsByCategory = () => {
  return useQuery({
    queryKey: ["dashboard", "products-by-category"],
    queryFn: fetchProductsByCategory,
  });
};

export const usePartnersByRegion = () => {
  return useQuery({
    queryKey: ["dashboard", "partners-by-region"],
    queryFn: fetchPartnersByRegion,
  });
};

export const useContentGrowth = (months = 12) => {
  return useQuery({
    queryKey: ["dashboard", "content-growth", months],
    queryFn: () => fetchContentGrowth(months),
  });
};

export const useRecentBlogs = (limit = 5) => {
  return useQuery({
    queryKey: ["dashboard", "recent-blogs", limit],
    queryFn: () => fetchRecentBlogs(limit),
  });
};

export const useUsersByRole = () => {
  return useQuery({
    queryKey: ["dashboard", "users-by-role"],
    queryFn: fetchUsersByRole,
  });
};
