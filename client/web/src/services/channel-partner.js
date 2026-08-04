import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

export const fetchChannelPartners = async (searchParams) => {
  const { data } = await http().get(
    `${endpoints.channelPartners.getAll}?${searchParams}`,
  );
  return data;
};

export const fetchChannelPartner = async (id) => {
  const { data } = await http().get(
    `${endpoints.channelPartners.getAll}/${id}`,
  );
  return data;
};

export const createChannelPartner = async (channelPartner) => {
  const { data } = await http().post(
    endpoints.channelPartners.getAll,
    channelPartner,
    true,
  );
  return data;
};

export const updateChannelPartner = async (id, channelPartner) => {
  const { data } = await http().put(
    `${endpoints.channelPartners.getAll}/${id}`,
    channelPartner,
    true,
  );
  return data;
};

export const deleteChannelPartner = async (id) => {
  return await http().delete(`${endpoints.channelPartners.getAll}/${id}`);
};
