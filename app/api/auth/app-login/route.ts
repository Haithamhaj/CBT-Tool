import { NextRequest, NextResponse } from "next/server";
import { getAppRepository } from "../../../../src/lib/app/repository-provider";
import { DEV_SESSION_COOKIE } from "../../../../src/lib/auth/constants";
import { isSharedPasswordAuthEnabled, requireAppAccessPassword } from "../../../../src/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!isSharedPasswordAuthEnabled()) {
    return NextResponse.json({ error: "Shared access login is disabled." }, { status: 400 });
  }

  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  if (password !== requireAppAccessPassword()) {
    return NextResponse.json({ error: "Invalid access password." }, { status: 401 });
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
