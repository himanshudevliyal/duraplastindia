import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchCustomPages = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.customPages.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchCustomPage = async (id) => {
  const { data } = await http().get(`${endpoints.customPages.getAll}/${id}`);
  return data;
};

export const createCustomPage = async (page) => {
  const { data } = await http().post(endpoints.customPages.getAll, page, true);
  return data;
};

export const updateCustomPage = async (id, page) => {
  const { data } = await http().put(
    `${endpoints.customPages.getAll}/${id}`,
    page,
    true,
  );
  return data;
};

export const deleteCustomPage = async (id) => {
  return await http().delete(`${endpoints.customPages.getAll}/${id}`);
};
