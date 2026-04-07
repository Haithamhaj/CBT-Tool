"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent } from "../../lib/app/analytics-client";

function getPayloadForPathname(pathname: string) {
  if (pathname === "/reference") {
    return {
      eventName: "page_view" as const,
      route: "/reference"
    };
  }

  if (pathname === "/lectures") {
    return {
      eventName: "page_view" as const,
      route: "/lectures"
    };
  }

  const lectureMatch = pathname.match(/^\/lectures\/([^/]+)$/);
  if (lectureMatch) {
    return {
      eventName: "page_view" as const,
      route: "/lectures/[slug]",
      lectureSlug: lectureMatch[1]
    };
  }

  const pdfMatch = pathname.match(/^\/lectures\/([^/]+)\/pdf$/);
  if (pdfMatch) {
    return {
      eventName: "lecture_pdf_opened" as const,
      route: "/lectures/[slug]/pdf",
      lectureSlug: pdfMatch[1]
    };
  }

  return null;
}

export function RouteAnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) {
      return;
    }

    const payload = getPayloadForPathname(pathname);
    if (!payload) {
      return;
    }

    lastTracked.current = pathname;
    void trackEvent(payload);
  }, [pathname]);

  return null;
}
