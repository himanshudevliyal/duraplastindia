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
