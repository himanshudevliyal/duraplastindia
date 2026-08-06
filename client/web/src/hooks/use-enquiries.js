import { createEnquiry } from "@/services/enquiry-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEnquiry = (callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      callback?.();
    },
  });
};
