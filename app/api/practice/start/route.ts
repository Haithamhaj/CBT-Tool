import { legacyFeatureDisabledResponse } from "../../../../src/lib/app/legacy-feature";

export async function POST() {
  return legacyFeatureDisabledResponse("Practice start");
}
