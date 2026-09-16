
import { endpoints } from "@/utils/endpoints";

import http from "@/utils/http";

export const subscribeNewsletter = async (data) => {
  const response = await http().post(
    endpoints.newsletters.subscribe,
    data,
  );

  return response.data;
};

export const fetchNewsletters = async (searchParams = "") => {
  const { data } = await http().get(
    `${endpoints.newsletters.getAll}?${searchParams}`,
  );

  return data;
};

export const fetchNewsletter = async (id) => {
  const { data } = await http().get(
    `${endpoints.newsletters.getAll}/${id}`,
  );

  return data;
};

export const createNewsletter = async (data) => {
  const response = await http().post(
    endpoints.newsletters.getAll,
    data,
    true,
  );

  return response.data;
};

export const updateNewsletter = async (id, data) => {
  return await http().put(
    `${endpoints.newsletters.getAll}/${id}`,
    data,
    true,
  );
};

export const deleteNewsletter = async (id) => {
  return await http().delete(
    `${endpoints.newsletters.getAll}/${id}`,
  );
};
