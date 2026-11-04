import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

// Active custom pages (drafts are never returned to the website)
export const fetchCustomPages = async (searchParams = "") => {
  const { data } = await http().get(
    `${endpoints.customPages.getAll}?${searchParams}`,
  );
  return data;
};

// country: "India" | "Australia" ... => that country's SEO / FAQs; empty => global.
// Returns null when the page does not exist (or is a draft).
export const fetchCustomPageBySlug = async (slug, country) => {
  const query = country ? `?country=${encodeURIComponent(country)}` : "";
  try {
    const { data } = await http().get(
      `${endpoints.customPages.getAll}/get-by-slug/${encodeURIComponent(slug)}${query}`,
    );
    return data;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};
