import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

const lecturesDirectory = path.join(process.cwd(), "content", "lectures");

const contentTypeSchema = z.enum(["conceptual", "diagnostic", "structural", "practical", "mixed"]);
const visualBlockTypeSchema = z.enum(["group-grid", "sequence", "comparison"]);

const summaryCardSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1)
});

const conceptSchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  lectureMeaning: z.string().min(1),
  misunderstanding: z.string().min(1).optional()
});

const keyDistinctionSchema = z.object({
  title: z.string().min(1),
  sideA: z.string().min(1),
  sideB: z.string().min(1),
  whyItMatters: z.string().min(1)
});

const frameworkSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).min(1)
});

const symptomGroupSchema = z.object({
  groupName: z.string().min(1),
  count: z.number().int().positive().optional(),
  items: z.array(z.string().min(1)).min(1)
});

const criteriaSchema = z.object({
  title: z.string().min(1),
  rules: z.array(z.string().min(1)).min(1),
  note: z.string().min(1).optional()
});

const stageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  markers: z.array(z.string().min(1)).optional()
});

const toolSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  whenUsed: z.string().min(1).optional(),
  warning: z.string().min(1).optional()
});

const warningSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1)
});

const misconceptionSchema = z.object({
  mistake: z.string().min(1),
  correction: z.string().min(1)
});

const qaHighlightSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  whyItMatters: z.string().min(1).optional()
});

const reflectionExerciseSchema = z.object({
  title: z.string().min(1),
  prompt: z.string().min(1),
  steps: z.array(z.string().min(1)).optional()
});

const livingRecapSchema = z.object({
  title: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1)
});

const visualBlockSchema = z.object({
  type: visualBlockTypeSchema,
  title: z.string().min(1),
  data: z.union([
    z.object({
      groups: z.array(
        z.object({
          title: z.string().min(1),
          items: z.array(z.string().min(1)).min(1)
        })
      ).min(1)
    }),
    z.object({
      steps: z.array(
        z.object({
          title: z.string().min(1),
          text: z.string().min(1)
        })
      ).min(1)
    }),
    z.object({
      leftTitle: z.string().min(1),
      rightTitle: z.string().min(1),
      rows: z.array(
        z.object({
          label: z.string().min(1),
          left: z.string().min(1),
          right: z.string().min(1)
        })
      ).min(1)
    })
  ])
});

const lectureFrontmatterSchema = z.object({
  slug: z.string().min(1),
  lectureNumber: z.number().int().positive(),
  title: z.string().min(1),
  realTopic: z.string().min(1),
  centralMessage: z.string().min(1),
  whyImportant: z.string().min(1),
  contentType: contentTypeSchema,
  tags: z.array(z.string().min(1)).min(1),
  contentLanguage: z.string().min(1).default("ar"),
  summaryCards: z.array(summaryCardSchema).optional(),
  concepts: z.array(conceptSchema).optional(),
  keyDistinctions: z.array(keyDistinctionSchema).optional(),
  frameworks: z.array(frameworkSchema).optional(),
  symptomGroups: z.array(symptomGroupSchema).optional(),
  criteria: z.array(criteriaSchema).optional(),
  stages: z.array(stageSchema).optional(),
  tools: z.array(toolSchema).optional(),
  warnings: z.array(warningSchema).optional(),
  misconceptions: z.array(misconceptionSchema).optional(),
  qaHighlights: z.array(qaHighlightSchema).optional(),
  thinkingQuestions: z.array(z.string().min(1)).optional(),
  reflectionExercise: reflectionExerciseSchema.optional(),
  livingRecap: livingRecapSchema.optional(),
  visualBlocks: z.array(visualBlockSchema).optional()
});

export type LectureContentType = z.infer<typeof contentTypeSchema>;
export type LectureSummaryCard = z.infer<typeof summaryCardSchema>;
export type LectureConcept = z.infer<typeof conceptSchema>;
export type LectureKeyDistinction = z.infer<typeof keyDistinctionSchema>;
export type LectureFramework = z.infer<typeof frameworkSchema>;
export type LectureSymptomGroup = z.infer<typeof symptomGroupSchema>;
export type LectureCriteria = z.infer<typeof criteriaSchema>;
export type LectureStage = z.infer<typeof stageSchema>;
export type LectureTool = z.infer<typeof toolSchema>;
export type LectureWarning = z.infer<typeof warningSchema>;
export type LectureMisconception = z.infer<typeof misconceptionSchema>;
export type LectureQaHighlight = z.infer<typeof qaHighlightSchema>;
export type LectureReflectionExercise = z.infer<typeof reflectionExerciseSchema>;
export type LectureLivingRecap = z.infer<typeof livingRecapSchema>;
export type LectureVisualBlock = z.infer<typeof visualBlockSchema>;

export type Lecture = z.infer<typeof lectureFrontmatterSchema> & {
  body: string;
  sourcePath: string;
};

export type LectureListItem = Pick<
  Lecture,
  "slug" | "lectureNumber" | "title" | "realTopic" | "whyImportant" | "contentType" | "tags" | "contentLanguage"
>;

function normalizeLecture(frontmatter: z.infer<typeof lectureFrontmatterSchema>, body: string, sourcePath: string): Lecture {
  return {
    ...frontmatter,
    body: body.trim(),
    sourcePath
  };
}

async function readLectureFile(fileName: string): Promise<Lecture> {
  const sourcePath = path.join(lecturesDirectory, fileName);
  const raw = await fs.readFile(sourcePath, "utf8");
  const parsed = matter(raw);
  const frontmatter = lectureFrontmatterSchema.parse(parsed.data);

  if (!parsed.content.trim()) {
    throw new Error(`Lecture file ${fileName} is missing body content.`);
  }

  return normalizeLecture(frontmatter, parsed.content, sourcePath);
}

const loadLectures = cache(async (): Promise<Lecture[]> => {
  const files = (await fs.readdir(lecturesDirectory)).filter((file) => file.endsWith(".md"));
  const lectures = await Promise.all(files.map((file) => readLectureFile(file)));
  const slugSet = new Set<string>();

  for (const lecture of lectures) {
    if (slugSet.has(lecture.slug)) {
      throw new Error(`Duplicate lecture slug found: ${lecture.slug}`);
    }
    slugSet.add(lecture.slug);
  }

  return lectures.sort((a, b) => a.lectureNumber - b.lectureNumber);
});

export async function listLectures(): Promise<LectureListItem[]> {
  const lectures = await loadLectures();
  return lectures.map((lecture) => ({
    slug: lecture.slug,
    lectureNumber: lecture.lectureNumber,
    title: lecture.title,
    realTopic: lecture.realTopic,
    whyImportant: lecture.whyImportant,
    contentType: lecture.contentType,
    tags: lecture.tags,
    contentLanguage: lecture.contentLanguage
  }));
}

export async function getLectureBySlug(slug: string): Promise<Lecture | null> {
  const lectures = await loadLectures();
  return lectures.find((lecture) => lecture.slug === slug) ?? null;
}

export async function getLectureSlugs(): Promise<string[]> {
  const lectures = await loadLectures();
  return lectures.map((lecture) => lecture.slug);
}
