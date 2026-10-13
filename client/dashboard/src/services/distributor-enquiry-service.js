import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchDistributorEnquiries = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.distributorEnquiries.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchDistributorEnquiry = async (id) => {
  const { data } = await http().get(
    `${endpoints.distributorEnquiries.getAll}/${id}`,
  );
  return data;
};

export const fetchDistributorEnquiryOptions = async () => {
  const { data } = await http().get(
    `${endpoints.distributorEnquiries.getAll}/options`,
  );
  return data;
};

export const updateDistributorEnquiry = async (id, enquiry) => {
  const { data } = await http().put(
    `${endpoints.distributorEnquiries.getAll}/${id}`,
    enquiry,
  );
  return data;
};

export const deleteDistributorEnquiry = async (id) => {
  return await http().delete(`${endpoints.distributorEnquiries.getAll}/${id}`);
};
