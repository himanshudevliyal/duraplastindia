import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  console.log("requestLocale:", requested);

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  console.log("resolved locale:", locale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
