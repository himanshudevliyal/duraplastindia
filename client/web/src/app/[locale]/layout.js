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
import Script from "next/script";
import DistributorPopup from "@/components/distributor-popup";
import { CLIENT_NAMESPACES, pickMessages } from "@/lib/messages";
import { htmlLang, siteMetadata } from "@/lib/seo";
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
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  // Enable static rendering
  const messages = await getMessages();

  // Header menu + products list data rendered on the server (see lib/menu-data.js)
  const queryClient = new QueryClient();
  seedMenuQueries(queryClient, await getMenuData());

  setRequestLocale(locale);

  return (
    <html
      lang={htmlLang(locale)}
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

  <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9HCDEP5C1R"
          strategy="lazyOnload"
          nonce={nonce}
        />

        <Script id="google-analytics" strategy="lazyOnload" nonce={nonce}>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-9HCDEP5C1R');
          `}
        </Script>


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
