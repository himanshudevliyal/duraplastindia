import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChannelPartner,
  deleteChannelPartner,
  fetchChannelPartner,
  fetchChannelPartners,
  updateChannelPartner,
} from "@/services/channel-partner";

export const useChannelPartners = (searchParams = "") => {
  return useQuery({
    queryKey: ["channel-partners", searchParams],
    queryFn: () => fetchChannelPartners(searchParams),
  });
};

export const useChannelPartner = (id) => {
  return useQuery({
    queryKey: ["channel-partners", id],
    queryFn: () => fetchChannelPartner(id),
    enabled: !!id,
  });
};

export const useCreateChannelPartner = (callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChannelPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-partners"],
      });
      callback?.();
    },
  });
};

export const useUpdateChannelPartner = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelPartner) => updateChannelPartner(id, channelPartner),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-partners"],
      });
      callback?.();
    },
  });
};

export const useDeleteChannelPartner = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteChannelPartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-partners"],
      });
      callback?.();
    },
  });
};
