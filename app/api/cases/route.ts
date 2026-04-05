import { NextResponse } from "next/server";
import { legacyFeatureDisabledResponse } from "../../../src/lib/app/legacy-feature";

export async function GET() {
  return legacyFeatureDisabledResponse("Cases API");
}
