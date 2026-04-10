import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEV_SESSION_COOKIE } from "./src/lib/auth/constants";
import { createSupabaseMiddlewareClient } from "./src/lib/supabase/server";
import { isAppManagedAuthEnabled, isPreviewAccessEnabled, isSupabaseConfigured } from "./src/lib/supabase/env";

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/login" ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/api/auth/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasDevSession = Boolean(request.cookies.get(DEV_SESSION_COOKIE)?.value);

  if (isAppManagedAuthEnabled()) {
    if (pathname === "/login") {
      if (hasDevSession) {
        return NextResponse.redirect(new URL("/reference", request.url));
      }
      return NextResponse.next();
    }

    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    if (!hasDevSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (!isSupabaseConfigured()) {
      if (hasDevSession) {
        return NextResponse.redirect(new URL("/reference", request.url));
      }
      return NextResponse.next();
    }

    if (isPreviewAccessEnabled() && hasDevSession) {
      return NextResponse.redirect(new URL("/reference", request.url));
    }

    const response = NextResponse.next({ request });
    const supabase = createSupabaseMiddlewareClient(request, response);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(new URL("/reference", request.url));
    }

    return response;
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    if (!hasDevSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createSupabaseMiddlewareClient(request, response);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && !(isPreviewAccessEnabled() && hasDevSession)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
