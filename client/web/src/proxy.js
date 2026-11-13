import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { getSiteLanguages } from "@/lib/site-languages";
import { loadLangMessages } from "@/i18n/lang-messages";
import {
  LANG_PAGE_HEADER,
  LANG_PATH_HEADER,
  langPageType,
} from "@/lib/lang-routes";

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

// /<country>/<lang>/<path> => the /<country>/<path> page in that language
// (x-lang header), when <lang> is a live extra language of that country
// (Dashboard > Languages). /<country>/<default lang>/... => /<country>/...
// Returns a response, or null when the URL is not a language URL.
async function languageResponse(request, csp) {
  const { pathname, search } = request.nextUrl;
  const [, locale, lang, ...rest] = pathname.split("/");
  if (!locale || !lang || !/^[a-z]{2,3}$/.test(lang)) return null;
  if (locale === routing.defaultLocale || !routing.locales.includes(locale)) return null;

  const site = (await getSiteLanguages())?.[locale];
  if (!site) return null;
  // without a trailing slash
  let path = `/${rest.join("/")}`;
  while (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  if (lang === site.default) {
    const target = new URL(`/${locale}${path === "/" ? "" : path}${search}`, request.url);
    return NextResponse.redirect(target, 308);
  }
  if (!site.languages.some((l) => l.code === lang)) return null;

  // a fixed page (home, about ...) without texts in this language: the
  // site's 404 page (a missing route => app/[locale]/[...rest])
  const pageType = langPageType(path);
  if (pageType === "static") {
    const texts = await loadLangMessages(locale, lang);
    if (!texts?._pages?.includes(path)) {
      const response = NextResponse.rewrite(
        new URL(`/${locale}/_page-not-found`, request.url),
        { request: { headers: request.headers } },
      );
      response.headers.set("Content-Security-Policy", csp);
      return response;
    }
  }

  request.headers.set("x-lang", lang);
  request.headers.set(LANG_PAGE_HEADER, pageType);
  request.headers.set(LANG_PATH_HEADER, path);
  // next-intl's middleware is skipped here: pass the locale it would set
  request.headers.set("X-NEXT-INTL-LOCALE", locale);
  const target = new URL(`/${locale}${path === "/" ? "" : path}${search}`, request.url);
  const response = NextResponse.rewrite(target, {
    request: { headers: request.headers },
  });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export default async function proxy(request) {
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);

  // Next.js reads the nonce from the request CSP header while rendering
  // (next-intl forwards these request headers).
  request.headers.set("x-nonce", nonce);
  request.headers.set("Content-Security-Policy", csp);
  // never trust these from the browser
  request.headers.delete("x-lang");
  request.headers.delete(LANG_PAGE_HEADER);
  request.headers.delete(LANG_PATH_HEADER);

  const languageUrl = await languageResponse(request, csp);
  if (languageUrl) return languageUrl;

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
