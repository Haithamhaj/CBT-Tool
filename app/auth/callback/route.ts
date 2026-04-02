import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "../../../src/lib/supabase/server";
import { isSupabaseConfigured } from "../../../src/lib/supabase/env";

export async function GET(request: NextRequest) {
  const redirectUrl = new URL("/practice/setup", request.url);
  const loginUrl = new URL("/login", request.url);
  const code = request.nextUrl.searchParams.get("code");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  const supabase = createSupabaseRouteHandlerClient(request, response);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      loginUrl.searchParams.set("error", "authCallbackFailed");
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}
