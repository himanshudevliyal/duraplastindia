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
// lang: a language version (e.g. "fr"); null when it does not exist (404)
export const fetchCustomPageBySlug = async (slug, country, lang) => {
  const params = new URLSearchParams();
  if (country) params.set("country", country);
  if (lang) params.set("lang", lang);
  const query = params.size ? `?${params}` : "";
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
