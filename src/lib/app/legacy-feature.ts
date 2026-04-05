import { NextResponse } from "next/server";

export function legacyFeatureDisabledResponse(feature: string) {
  return NextResponse.json(
    {
      error: `${feature} is no longer available in the reference-only app.`,
      reference_redirect: "/reference"
    },
    { status: 410 }
  );
}
