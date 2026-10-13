import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDistributorEnquiries,
  fetchDistributorEnquiry,
  fetchDistributorEnquiryOptions,
  updateDistributorEnquiry,
  deleteDistributorEnquiry,
} from "@/services/distributor-enquiry-service";

export const useDistributorEnquiries = (searchParams = "") => {
  return useQuery({
    queryKey: ["distributor-enquiries", searchParams],
    queryFn: () => fetchDistributorEnquiries(searchParams),
  });
};

export const useDistributorEnquiry = (id) => {
  return useQuery({
    queryKey: ["distributor-enquiries", id],
    queryFn: () => fetchDistributorEnquiry(id),
    enabled: !!id,
  });
};

export const useDistributorEnquiryOptions = () => {
  return useQuery({
    queryKey: ["distributor-enquiry-options"],
    queryFn: fetchDistributorEnquiryOptions,
    staleTime: Infinity,
  });
};

export const useUpdateDistributorEnquiry = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enquiry) => updateDistributorEnquiry(id, enquiry),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distributor-enquiries"],
      });

      callback?.();
    },
  });
};

export const useDeleteDistributorEnquiry = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteDistributorEnquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distributor-enquiries"],
      });

      callback?.();
    },
  });
};
