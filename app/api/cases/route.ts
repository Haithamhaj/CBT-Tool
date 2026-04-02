import { NextResponse } from "next/server";
import { getAppRepository } from "../../../src/lib/app/repository-provider";
import { getCurrentSessionUser } from "../../../src/lib/app/runtime-auth";

export async function GET() {
  const currentUser = await getCurrentSessionUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const repository = getAppRepository();
  const caseIds = ["B001", "B002", "B003", "B004", "B005", "I001", "I002", "I003", "A001", "A002"];
  const cases = await Promise.all(caseIds.map((caseId) => repository.getCase(caseId)));
  return NextResponse.json(cases.filter(Boolean));
}
