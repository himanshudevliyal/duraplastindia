import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/nav";

const universalSans = localFont({
  src: "../../public/font/universal_sans/Universal-Sans-Text-Regular.woff2",
  variable: "--font-universal-sans",
});

const universalDisplay = localFont({
  src: "../../public/font/universal_sans/Universal-Sans-Display-Medium.woff2",
  variable: "--font-universal-display",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${universalSans.variable} ${universalDisplay.variable}`}
    >
      <body className={`${universalSans.className} min-h-screen`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
