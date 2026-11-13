import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLanguage,
  deleteLanguage,
  fetchCountryLanguages,
  fetchLanguages,
  saveCountryLanguages,
  updateLanguage,
} from "@/services/language-service";

export const useLanguages = () =>
  useQuery({ queryKey: ["languages"], queryFn: fetchLanguages });

export const useCountryLanguages = () =>
  useQuery({ queryKey: ["country-languages"], queryFn: fetchCountryLanguages });

// any change can affect both lists
const useLanguageMutation = (mutationFn, callback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
      queryClient.invalidateQueries({ queryKey: ["country-languages"] });
      callback?.(res);
    },
  });
};

export const useCreateLanguage = (callback) =>
  useLanguageMutation(createLanguage, callback);

export const useUpdateLanguage = (callback) =>
  useLanguageMutation(({ code, ...data }) => updateLanguage(code, data), callback);

export const useDeleteLanguage = (callback) =>
  useLanguageMutation(deleteLanguage, callback);

export const useSaveCountryLanguages = (callback) =>
  useLanguageMutation(
    ({ country, ...payload }) => saveCountryLanguages(country, payload),
    callback,
  );
