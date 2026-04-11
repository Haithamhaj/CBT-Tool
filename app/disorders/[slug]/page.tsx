import { notFound } from "next/navigation";
import { DisorderView } from "../../../src/components/disorders/disorder-view";
import { getDisorderBySlug, getDisorderSlugs } from "../../../src/lib/content/disorders";

export async function generateStaticParams() {
  const slugs = await getDisorderSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function DisorderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const disorder = await getDisorderBySlug(slug);

  if (!disorder) {
    notFound();
  }

  return <DisorderView disorder={disorder} />;
}
