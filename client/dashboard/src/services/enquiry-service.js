import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchEnquiries = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.enquiries.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchEnquiry = async (id) => {
  const { data } = await http().get(`${endpoints.enquiries.getAll}/${id}`);
  return data;
};

export const createEnquiry = async (enquiry) => {
  const { data } = await http().post(endpoints.enquiries.getAll, enquiry, true);
  return data;
};

export const updateEnquiry = async (id, enquiry) => {
  const { data } = await http().put(
    `${endpoints.enquiries.getAll}/${id}`,
    enquiry,
    true,
  );
  return data;
};

export const deleteEnquiry = async (id) => {
  return await http().delete(`${endpoints.enquiries.getAll}/${id}`);
};
