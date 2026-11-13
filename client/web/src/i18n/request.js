import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { routing } from "@/i18n/routing";
import { loadLangMessages, mergeMessages, messagesBase } from "@/i18n/lang-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // "global" has no messages file of its own — it uses the India (en) copy.
  const messages = (await import(`../../messages/${messagesBase(locale)}.json`))
    .default;

  // language URL (/<country>/<lang>/...): its texts over the default ones
  const lang = (await headers()).get("x-lang");

  return {
    locale,
    messages: mergeMessages(messages, await loadLangMessages(locale, lang)),
  };
});
