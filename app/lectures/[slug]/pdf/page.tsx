import { notFound } from "next/navigation";
import { LecturePdfView } from "../../../../src/components/lectures/lecture-pdf-view";
import { getCurrentLanguage } from "../../../../src/lib/app/runtime-language";
import { getLectureBySlug, getLectureSlugs } from "../../../../src/lib/content/lectures";

export async function generateStaticParams() {
  const slugs = await getLectureSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function LecturePdfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = await getLectureBySlug(slug);
  const language = await getCurrentLanguage();

  if (!lecture) {
    notFound();
  }

  return <LecturePdfView lecture={lecture} language={language} />;
}
