import localFont from "next/font/local";
import "../globals.css";

import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/nav";

import { NextIntlClientProvider, hasLocale } from "next-intl";

import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/query-client-provider";
import DeferredAnalytics from "@/components/deferred-analytics";
import DistributorPopup from "@/components/distributor-popup";
import { CLIENT_NAMESPACES, pickMessages } from "@/lib/messages";
import { siteMetadata } from "@/lib/seo";
import { htmlLangOf } from "@/lib/lang";
import { LANG_PAGE_HEADER, LANG_PATH_HEADER } from "@/lib/lang-routes";
import { loadLangMessages } from "@/i18n/lang-messages";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getMenuData, seedMenuQueries } from "@/lib/menu-data";

// Local Fonts
const universalSans = localFont({
  src: "../../../public/font/universal_sans/Universal-Sans-Text-Regular.woff2",
  variable: "--font-universal-sans",
  display: "swap",
});

const universalDisplay = localFont({
  src: "../../../public/font/universal_sans/Universal-Sans-Display-Medium.woff2",
  variable: "--font-universal-display",
  display: "swap",
});

// Robots, author, publisher + base URL for canonicals (all pages)
export const metadata = siteMetadata;

// Generate locale pages
export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

// Root Layout
export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Unknown first segment (e.g. /robots.txt, /llms.txt) is not a locale:
  // return a real 404 instead of rendering the home page for it.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // CSP nonce from proxy.js (for the analytics scripts below)
  const requestHeaders = await headers();
  const nonce = requestHeaders.get("x-nonce") ?? undefined;

  // language URL (/<country>/<lang>/...) — see proxy.js / lib/lang-routes.js.
  // Home, about, lists ... exist in a language only when its texts file
  // (messages/<country>.<lang>.json) lists the page in "_pages".
  const lang = requestHeaders.get("x-lang");
  if (lang && requestHeaders.get(LANG_PAGE_HEADER) === "static") {
    const texts = await loadLangMessages(locale, lang);
    if (!texts?._pages?.includes(requestHeaders.get(LANG_PATH_HEADER))) {
      notFound();
    }
  }

  // locale first, so the messages below are this site's (also on language
  // URLs, where proxy.js skips next-intl's middleware)
  setRequestLocale(locale);
  const messages = await getMessages();

  // Header menu + products list data rendered on the server (see lib/menu-data.js)
  const queryClient = new QueryClient();
  seedMenuQueries(queryClient, await getMenuData());

  return (
    <html
      lang={htmlLangOf(locale, lang)}
      data-lang={lang || undefined}
      className={`
        ${universalSans.variable}
        ${universalDisplay.variable}
      `}
      suppressHydrationWarning
    >
      <body
        className={`
          ${universalSans.className}
          min-h-screen
          bg-secondary/10
          antialiased
          overscroll-none
        `}
        suppressHydrationWarning
      >

        {/* Google Analytics: loaded on first interaction / 5s after load */}
        <DeferredAnalytics nonce={nonce} />


        <NextIntlClientProvider
          locale={locale}
          messages={pickMessages(messages, CLIENT_NAMESPACES)}
        >
          <QueryProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <SiteHeader />
              {children}
              <SiteFooter />
              <DistributorPopup />
            </HydrationBoundary>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
