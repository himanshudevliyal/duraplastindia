import "./globals.css";
import Layout from "@/components/layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Outfit, Fira_Code } from "next/font/google";

const firacode = Fira_Code({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-fira",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Dura Plast Admin",
  description: "Manage products, blogs, pages and enquiries.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${firacode.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <Layout>{children}</Layout>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
