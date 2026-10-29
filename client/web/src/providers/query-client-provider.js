"use client";
import { handleError } from "@/lib/handle-error-toast";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }) {
  // one client per browser session (a new client on every render drops the cache)
  const [queryClient] = useState(
    () =>
      new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        refetchOnWindowFocus: false,
        // server-prefetched data is used as-is instead of refetching on mount
        staleTime: 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // console.error("Query failed:", query.queryKey, error);
        handleError(error, "Failed to fetch data.");
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.error("Mutation failed:", mutation.options.mutationKey, error);
        handleError(error, "Failed to perform action.");
      },
      onSuccess: (data, variables, context, mutation) => {
        console.log("Mutation success:", mutation.options.mutationKey);
        // toast.success("Operation successful!");
      },
    }),
  }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
