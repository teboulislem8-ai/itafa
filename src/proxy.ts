import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOCALE_COOKIE = "NEXT_LOCALE";

const SUPPORTED_LOCALES = ["ar", "fr", "en"];

const PUBLIC_ROUTES = new Set([
  "/login",
  "/register",
  "/auth/callback",
]);

const API_PREFIX = "/api/";
const STATIC_PREFIX = "/_next/static/";

function isPublicRoute(pathname: string): boolean {
  if (pathname.startsWith(API_PREFIX)) return true;
  if (pathname.startsWith(STATIC_PREFIX)) return true;
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (user && (!currentLocale || !SUPPORTED_LOCALES.includes(currentLocale))) {
    const profileLocale = user.user_metadata?.language as string | undefined;

    if (profileLocale && SUPPORTED_LOCALES.includes(profileLocale)) {
      supabaseResponse.cookies.set(LOCALE_COOKIE, profileLocale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
  }

  if (!user && !isPublicRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
