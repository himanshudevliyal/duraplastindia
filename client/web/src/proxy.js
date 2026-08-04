import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Routes that a logged-in user should never see (e.g. the login page).
// Pathnames here are locale-agnostic (no locale prefix).
const authOnlyRoutes = ["/login"];

export default function proxy(request) {
  const response = handleI18nRouting(request);

  if (response.ok) {
    const rewrittenUrl = new URL(
      response.headers.get("x-middleware-rewrite") || request.url,
    );
    const [, locale, ...rest] = rewrittenUrl.pathname.split("/");
    const pathname = `/${rest.join("/")}`;

    const token = request.cookies.get("token")?.value;

    if (token && authOnlyRoutes.includes(pathname)) {
      // "always" mode → every locale, including default, gets a prefix
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
