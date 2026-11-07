import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchSolutions = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.solutions.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchSolution = async (id) => {
  const { data } = await http().get(`${endpoints.solutions.getAll}/${id}`);
  return data;
};

export const createSolution = async (solution) => {
  const { data } = await http().post(endpoints.solutions.getAll, solution, true);
  return data;
};

export const updateSolution = async (id, solution) => {
  const { data } = await http().put(
    `${endpoints.solutions.getAll}/${id}`,
    solution,
    true,
  );
  return data;
};

export const deleteSolution = async (id) => {
  return await http().delete(`${endpoints.solutions.getAll}/${id}`);
};

// country: "India" / "Global" ... => that country's content / SEO.
// Returns null when the slug does not exist.
export const fetchSolutionBySlug = async (slug, country) => {
  const query = country ? `?country=${encodeURIComponent(country)}` : "";
  try {
    const { data } = await http().get(
      `${endpoints.solutions.getAll}/get-by-slug/${encodeURIComponent(slug)}${query}`,
    );
    return data;
  } catch (error) {
    // unknown slug => null => the page shows 404 (not a server error)
    if (error?.response?.status === 404) return null;
    throw error;
  }
};
