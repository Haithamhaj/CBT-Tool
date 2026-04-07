import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { Pool } from "pg";
import { z } from "zod";
import { requireDatabaseUrl } from "./runtime-env";
import { getCurrentSessionUser } from "./runtime-auth";

declare global {
  // eslint-disable-next-line no-var
  var __cbt_analytics_pool__: Pool | undefined;
}

export const ANALYTICS_VISITOR_COOKIE = "cbt_visitor_key";

export const analyticsEventSchema = z.object({
  eventName: z.enum(["page_view", "lecture_pdf_opened", "lecture_print_clicked"]),
  route: z.string().min(1).max(200),
  lectureSlug: z.string().min(1).max(200).optional(),
  referenceSection: z.string().min(1).max(200).optional()
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

function getAnalyticsPool() {
  if (!globalThis.__cbt_analytics_pool__) {
    globalThis.__cbt_analytics_pool__ = new Pool({
      connectionString: requireDatabaseUrl()
    });
  }

  return globalThis.__cbt_analytics_pool__;
}

export async function getOrCreateVisitorKey() {
  const cookieStore = await cookies();
  const current = cookieStore.get(ANALYTICS_VISITOR_COOKIE)?.value;

  if (current) {
    return current;
  }

  const visitorKey = randomUUID();
  cookieStore.set(ANALYTICS_VISITOR_COOKIE, visitorKey, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
  return visitorKey;
}

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  if (!process.env.DATABASE_URL) {
    return { ok: false as const, reason: "database_unavailable" };
  }

  const payload = analyticsEventSchema.parse(input);
  const visitorKey = await getOrCreateVisitorKey();
  const currentUser = await getCurrentSessionUser().catch(() => null);

  try {
    await getAnalyticsPool().query(
      `insert into analytics_events (
        event_name,
        route,
        lecture_slug,
        reference_section,
        user_id,
        visitor_key
      ) values ($1, $2, $3, $4, $5, $6)`,
      [
        payload.eventName,
        payload.route,
        payload.lectureSlug ?? null,
        payload.referenceSection ?? null,
        currentUser?.id ?? null,
        visitorKey
      ]
    );

    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";

    if (message.includes("relation \"analytics_events\" does not exist")) {
      return { ok: false as const, reason: "migration_missing" };
    }

    console.error("[analytics.record_failed]", message);
    return { ok: false as const, reason: "insert_failed" };
  }
}
