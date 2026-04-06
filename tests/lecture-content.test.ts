import { describe, expect, it } from "vitest";
import { getLectureBySlug, listLectures } from "../src/lib/content/lectures";

describe("lecture content loader", () => {
  it("lists lectures in lecture number order", async () => {
    const lectures = await listLectures();

    expect(lectures.length).toBeGreaterThan(0);
    expect(lectures.map((lecture) => lecture.lectureNumber)).toEqual([...lectures.map((lecture) => lecture.lectureNumber)].sort((a, b) => a - b));
  });

  it("loads a lecture with required fields and body", async () => {
    const lecture = await getLectureBySlug("lecture-10-depression");

    expect(lecture).not.toBeNull();
    expect(lecture?.title).toBe("الاكتئاب");
    expect(lecture?.body.length).toBeGreaterThan(100);
    expect(lecture?.symptomGroups?.length).toBeGreaterThan(0);
  });

  it("returns null for unknown slug", async () => {
    const lecture = await getLectureBySlug("missing-lecture");
    expect(lecture).toBeNull();
  });
});
