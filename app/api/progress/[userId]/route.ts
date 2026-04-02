import { NextRequest, NextResponse } from "next/server";
import { getAppRepository } from "../../../../src/lib/app/repository-provider";
import { buildHandlers } from "../../../../src/lib/api/handlers";
import { getCurrentSessionUser } from "../../../../src/lib/app/runtime-auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await buildHandlers(getAppRepository()).progressGet({
    actor_user_id: currentUser.id,
    actor_role: currentUser.role,
    user_id: userId
  });

  return NextResponse.json(response.body, { status: response.status });
}
