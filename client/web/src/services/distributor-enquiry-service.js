import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const createDistributorEnquiry = async (body) => {
  const { data } = await http().post(
    endpoints.distributorEnquiries.getAll,
    body,
  );
  return data;
};
