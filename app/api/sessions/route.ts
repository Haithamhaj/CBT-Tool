import { NextResponse } from "next/server";
import { getAppRepository } from "../../../src/lib/app/repository-provider";
import { getCurrentSessionUser } from "../../../src/lib/app/runtime-auth";
import { SessionQueryService } from "../../../src/lib/services/session-query-service";

export async function GET() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await new SessionQueryService(getAppRepository()).listRecentSessions(currentUser.id);
  return NextResponse.json(sessions);
}
