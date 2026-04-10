import { NextRequest, NextResponse } from "next/server";
import { DEV_SESSION_COOKIE } from "../../../../src/lib/auth/constants";
import { isSharedPasswordAuthEnabled, isSupabaseConfigured } from "../../../../src/lib/supabase/env";
import { createSupabaseRouteHandlerClient } from "../../../../src/lib/supabase/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });

  if (isSupabaseConfigured() && !isSharedPasswordAuthEnabled()) {
    const supabase = createSupabaseRouteHandlerClient(request, response);
    await supabase.auth.signOut();
  }

  response.cookies.set(DEV_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
