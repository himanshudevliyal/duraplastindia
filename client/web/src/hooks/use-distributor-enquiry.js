import { createDistributorEnquiry } from "@/services/distributor-enquiry-service";
import { useMutation } from "@tanstack/react-query";

export const useCreateDistributorEnquiry = (callback) => {
  return useMutation({
    mutationFn: createDistributorEnquiry,
    onSuccess: () => {
      callback?.();
    },
  });
};
