import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";

// master list of languages
export const fetchLanguages = async () => {
  const { data } = await http().get(endpoints.languages.getAll);
  return data;
};

export const createLanguage = async (language) =>
  await http().post(endpoints.languages.getAll, language);

export const updateLanguage = async (code, language) =>
  await http().put(`${endpoints.languages.getAll}/${code}`, language);

export const deleteLanguage = async (code) =>
  await http().delete(`${endpoints.languages.getAll}/${code}`);

// every website country with its languages + default
export const fetchCountryLanguages = async () => {
  const { data } = await http().get(`${endpoints.languages.getAll}/countries`);
  return data;
};

// { languages: [{ code, enabled }], default: "en" }
export const saveCountryLanguages = async (country, payload) =>
  await http().put(
    `${endpoints.languages.getAll}/countries/${encodeURIComponent(country)}`,
    payload,
  );
