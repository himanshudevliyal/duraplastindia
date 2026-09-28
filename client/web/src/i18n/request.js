import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { GLOBAL_LOCALE } from "@/utils/country-mapping";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  console.log("requestLocale:", requested);

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  console.log("resolved locale:", locale);

  return {
    locale,
    // "global" has no messages file of its own — it uses the India (en) copy.
    messages: (
      await import(
        `../../messages/${locale === GLOBAL_LOCALE ? "in" : locale}.json`
      )
    ).default,
  };
});
