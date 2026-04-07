"use client";

type TrackEventInput = {
  eventName: "page_view" | "lecture_pdf_opened" | "lecture_print_clicked";
  route: string;
  lectureSlug?: string;
  referenceSection?: string;
};

export async function trackEvent(input: TrackEventInput) {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input),
      keepalive: true
    });
  } catch {
    // Analytics must never block the UI.
  }
}
