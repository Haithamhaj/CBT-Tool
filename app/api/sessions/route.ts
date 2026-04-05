import { legacyFeatureDisabledResponse } from "../../../src/lib/app/legacy-feature";

export async function GET() {
  return legacyFeatureDisabledResponse("Sessions list");
}
