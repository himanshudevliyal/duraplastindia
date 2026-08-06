import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const createEnquiry = async (body) => {
  const { data } = await http().post(endpoints.enquiries.getAll, body);
  return data;
};
