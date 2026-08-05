import localFont from "next/font/local";
import "../globals.css";

import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/nav";

import { NextIntlClientProvider } from "next-intl";

import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { routing } from "@/i18n/routing";
import QueryProvider from "@/providers/query-client-provider";
// import { notFound } from "next/navigation";

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

// Generate locale pages
export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

// Root Layout
export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  // Validate locale
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  // Enable static rendering
  const messages = await getMessages();

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
