import type { NextRequest } from "next/server";
import { legacyFeatureDisabledResponse } from "../../../../src/lib/app/legacy-feature";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  await context.params;
  return legacyFeatureDisabledResponse("Session view");
}
