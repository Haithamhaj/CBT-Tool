import { Pool } from "pg";
import { getLectureBySlug, listLectures } from "../content/lectures";
import { requireDatabaseUrl } from "./runtime-env";

declare global {
  // eslint-disable-next-line no-var
  var __cbt_analytics_dashboard_pool__: Pool | undefined;
}

type UsageOverview = {
  totalVisits7d: number;
  uniqueVisitors7d: number;
  lectureVisits7d: number;
  referenceVisits7d: number;
  pdfOpens7d: number;
};

type TopRoute = {
  route: string;
  visits: number;
  unique_visitors: number;
  last_visit: string;
};

type TopLecture = {
  lecture_slug: string;
  visits: number;
  pdf_opens: number;
  last_visit: string;
};

type LectureInventoryRow = {
  lectureNumber: number;
  title: string;
  contentType: string;
  tagsCount: number;
  hasConcepts: boolean;
  hasWarnings: boolean;
  hasVisuals: boolean;
  hasRecap: boolean;
};

export type AnalyticsDashboardData = {
  usage: UsageOverview;
  topRoutes: TopRoute[];
  topLectures: Array<TopLecture & { title: string }>;
};

export type LectureInventoryData = {
  totalPublished: number;
  missingLectureNumbers: number[];
  byContentType: Record<string, number>;
  bodyOnlyCount: number;
  richSupportCount: number;
  lectures: LectureInventoryRow[];
};

function getPool() {
  if (!globalThis.__cbt_analytics_dashboard_pool__) {
    globalThis.__cbt_analytics_dashboard_pool__ = new Pool({
      connectionString: requireDatabaseUrl()
    });
  }

  return globalThis.__cbt_analytics_dashboard_pool__;
}

function zeroUsage(): UsageOverview {
  return {
    totalVisits7d: 0,
    uniqueVisitors7d: 0,
    lectureVisits7d: 0,
    referenceVisits7d: 0,
    pdfOpens7d: 0
  };
}

export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  if (!process.env.DATABASE_URL) {
    return { usage: zeroUsage(), topRoutes: [], topLectures: [] };
  }

  try {
    const pool = getPool();

    const [usageResult, routesResult, lecturesResult] = await Promise.all([
      pool.query<UsageOverview>(
        `select
           count(*) filter (where event_name = 'page_view')::int as "totalVisits7d",
           count(distinct visitor_key)::int as "uniqueVisitors7d",
           count(*) filter (
             where event_name = 'page_view'
               and lecture_slug is not null
               and route = '/lectures/[slug]'
           )::int as "lectureVisits7d",
           count(*) filter (
             where event_name = 'page_view'
               and route = '/reference'
           )::int as "referenceVisits7d",
           count(*) filter (where event_name = 'lecture_pdf_opened')::int as "pdfOpens7d"
         from analytics_events
         where created_at >= timezone('utc', now()) - interval '7 days'`
      ),
      pool.query<TopRoute>(
        `select
           route,
           count(*)::int as visits,
           count(distinct visitor_key)::int as unique_visitors,
           max(created_at)::text as last_visit
         from analytics_events
         where created_at >= timezone('utc', now()) - interval '30 days'
           and event_name = 'page_view'
         group by route
         order by visits desc, last_visit desc
         limit 10`
      ),
      pool.query<TopLecture>(
        `select
           lecture_slug,
           count(*) filter (where event_name = 'page_view')::int as visits,
           count(*) filter (where event_name = 'lecture_pdf_opened')::int as pdf_opens,
           max(created_at)::text as last_visit
         from analytics_events
         where created_at >= timezone('utc', now()) - interval '30 days'
           and lecture_slug is not null
         group by lecture_slug
         order by visits desc, pdf_opens desc, last_visit desc
         limit 10`
      )
    ]);

    const lectureMap = new Map((await listLectures()).map((lecture) => [lecture.slug, lecture.title]));

    return {
      usage: usageResult.rows[0] ?? zeroUsage(),
      topRoutes: routesResult.rows,
      topLectures: lecturesResult.rows.map((row) => ({
        ...row,
        title: lectureMap.get(row.lecture_slug) ?? row.lecture_slug
      }))
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";

    if (message.includes("relation \"analytics_events\" does not exist")) {
      return { usage: zeroUsage(), topRoutes: [], topLectures: [] };
    }

    throw error;
  }
}

export async function getLectureInventoryData(): Promise<LectureInventoryData> {
  const lectures = await listLectures();
  const maxLectureNumber = lectures.reduce((max, lecture) => Math.max(max, lecture.lectureNumber), 0);
  const presentNumbers = new Set(lectures.map((lecture) => lecture.lectureNumber));
  const missingLectureNumbers: number[] = [];

  for (let index = 1; index <= maxLectureNumber; index += 1) {
    if (!presentNumbers.has(index)) {
      missingLectureNumbers.push(index);
    }
  }

  const byContentType = lectures.reduce<Record<string, number>>((accumulator, lecture) => {
    accumulator[lecture.contentType] = (accumulator[lecture.contentType] ?? 0) + 1;
    return accumulator;
  }, {});

  const rows = await Promise.all(
    lectures.map(async (listItem) => {
      const fullLecture = await getLectureBySlug(listItem.slug);

      return {
        lectureNumber: listItem.lectureNumber,
        title: listItem.title,
        contentType: listItem.contentType,
        tagsCount: listItem.tags.length,
        hasConcepts: Boolean(fullLecture?.concepts?.length),
        hasWarnings: Boolean(fullLecture?.warnings?.length || fullLecture?.misconceptions?.length),
        hasVisuals: Boolean(fullLecture?.visualBlocks?.length),
        hasRecap: Boolean(fullLecture?.livingRecap)
      };
    })
  );

  const richSupportCount = rows.filter((lecture) => lecture.hasConcepts || lecture.hasWarnings || lecture.hasVisuals || lecture.hasRecap).length;

  return {
    totalPublished: lectures.length,
    missingLectureNumbers,
    byContentType,
    bodyOnlyCount: lectures.length - richSupportCount,
    richSupportCount,
    lectures: rows
  };
}
