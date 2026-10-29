import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Routes that a logged-in user should never see (e.g. the login page).
// Pathnames here are locale-agnostic (no locale prefix).
const authOnlyRoutes = ["/login"];

const originOf = (url) => {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

// Backend API + uploaded files (product / blog images)
const apiOrigins = [
  ...new Set([
    originOf(process.env.NEXT_PUBLIC_API_URL),
    originOf(process.env.NEXT_PUBLIC_FILE_BASE),
  ]),
]
  .filter(Boolean)
  .join(" ");

// Google Analytics (gtag) endpoints
const analytics =
  "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com";

// Per-request nonce CSP. Next.js adds the nonce to its own scripts; scripts
// they load (gtag) are trusted through 'strict-dynamic'. Styles keep
// 'unsafe-inline' because pages and blog content use style attributes.
function contentSecurityPolicy(nonce) {
  const isDev = process.env.NODE_ENV === "development";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https: ${apiOrigins}`,
    "font-src 'self' data:",
    `connect-src 'self' ${apiOrigins} ${analytics}${isDev ? " ws:" : ""}`,
    // Google Maps embeds (contact page, channel partners)
    "frame-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

export default function proxy(request) {
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);

  // Next.js reads the nonce from the request CSP header while rendering
  // (next-intl forwards these request headers).
  request.headers.set("x-nonce", nonce);
  request.headers.set("Content-Security-Policy", csp);

  const response = handleI18nRouting(request);

  if (response.ok) {
    const rewrittenUrl = new URL(
      response.headers.get("x-middleware-rewrite") || request.url,
    );
    const [, locale, ...rest] = rewrittenUrl.pathname.split("/");
    const pathname = `/${rest.join("/")}`;

    const token = request.cookies.get("token")?.value;

    if (token && authOnlyRoutes.includes(pathname)) {
      // global (default) locale has no prefix, country locales do
      const home = locale === routing.defaultLocale ? "/" : `/${locale}/`;
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
