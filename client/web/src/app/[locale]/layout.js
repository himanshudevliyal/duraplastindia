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
import Script from "next/script";
import DistributorPopup from "@/components/distributor-popup";
import { CLIENT_NAMESPACES, pickMessages } from "@/lib/messages";
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

  <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9HCDEP5C1R"
          strategy="afterInteractive"
        />

        <Script id="google-analytics">
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
            <SiteHeader />
            {children}
            <SiteFooter />
             <DistributorPopup />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
