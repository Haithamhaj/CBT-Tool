import { NextResponse } from "next/server";
import { analyticsEventSchema, recordAnalyticsEvent } from "../../../src/lib/app/analytics-events";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const input = analyticsEventSchema.parse(raw);
    const result = await recordAnalyticsEvent(input);

    return NextResponse.json(
      {
        ok: result.ok,
        reason: result.ok ? null : result.reason
      },
      { status: 202 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid_request";

    return NextResponse.json(
      {
        ok: false,
        reason: message
      },
      { status: 400 }
    );
  }
}
