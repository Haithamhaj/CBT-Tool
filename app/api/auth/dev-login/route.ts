import { NextRequest, NextResponse } from "next/server";
import { getAppRepository } from "../../../../src/lib/app/repository-provider";
import { DEV_SESSION_COOKIE } from "../../../../src/lib/auth/constants";
import { isPreviewAccessEnabled } from "../../../../src/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!isPreviewAccessEnabled()) {
    return NextResponse.json({ error: "Preview access login is disabled in this environment." }, { status: 400 });
  }

  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await getAppRepository().getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "No user found for that email." }, { status: 404 });
  }

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      level: user.level
    }
  });

  response.cookies.set(DEV_SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return response;
}
