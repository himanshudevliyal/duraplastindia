
import { createNewsletter, deleteNewsletter, fetchNewsletter, fetchNewsletters, subscribeNewsletter, updateNewsletter } from "@/services/newsletter-service";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";



export const useNewsletters = (searchParams = "") => {
  return useQuery({
    queryKey: ["newsletters", searchParams],
    queryFn: () => fetchNewsletters(searchParams),
  });
};

export const useNewsletter = (id) => {
  return useQuery({
    queryKey: ["newsletters", id],
    queryFn: () => fetchNewsletter(id),
    enabled: !!id,
  });
};

export const useSubscribeNewsletter = (callback) => {
  return useMutation({
    mutationFn: subscribeNewsletter,

    onSuccess: () => {
      callback?.();
    },
  });
};

export const useCreateNewsletter = (callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewsletter,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["newsletters"],
      });

      callback?.();
    },
  });
};

export const useUpdateNewsletter = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newsletter) =>
      updateNewsletter(id, newsletter),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["newsletters"],
      });

      callback?.();
    },
  });
};

export const useDeleteNewsletter = (id, callback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteNewsletter(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["newsletters"],
      });

      callback?.();
    },
  });
};
