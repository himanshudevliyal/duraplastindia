// Shows an error toast. sonner is loaded only when this runs, so it is not
// part of every page's first load.
export const handleError = (
  error,
  defaultMessage = "Something went wrong."
) => {
  const message =
    error?.response?.data?.message ?? error?.message ?? defaultMessage;

  import("sonner").then(({ toast }) =>
    toast.error("Error", { description: message }),
  );
};
