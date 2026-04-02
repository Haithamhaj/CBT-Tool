import { NextRequest, NextResponse } from "next/server";
import { getAppRepository } from "../../../../src/lib/app/repository-provider";
import { buildHandlers } from "../../../../src/lib/api/handlers";
import { getCurrentSessionUser } from "../../../../src/lib/app/runtime-auth";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await request.json();
  const response = await buildHandlers(getAppRepository()).stepSubmit({
    ...payload,
    actor_user_id: currentUser.id,
    actor_role: currentUser.role
  });
  return NextResponse.json(response.body, { status: response.status });
}
