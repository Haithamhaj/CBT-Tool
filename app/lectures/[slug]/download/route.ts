import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { getLectureBySlug } from "../../../../src/lib/content/lectures";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = await getLectureBySlug(slug);

  if (!lecture) {
    return NextResponse.json({ error: "Lecture not found." }, { status: 404 });
  }

  const source = await fs.readFile(lecture.sourcePath, "utf8");

  return new NextResponse(source, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${lecture.slug}.md\"`
    }
  });
}
