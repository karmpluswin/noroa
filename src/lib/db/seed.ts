import { db } from "./index";
import { branch, program, scheme, semester, subject, topic, university } from "./schema";
import { source } from "./schema";
import { slugify } from "@/lib/utils/slug";
import { seedBranch, seedProgram, seedScheme, seedSubjects, seedUniversity } from "./seed-data";

async function main() {
  console.log("Seeding academic hierarchy...");

  const [uni] = await db
    .insert(university)
    .values({ ...seedUniversity, slug: slugify(seedUniversity.shortName) })
    .onConflictDoNothing({ target: university.slug })
    .returning();

  const universityRow =
    uni ??
    (await db.query.university.findFirst({
      where: (u, { eq }) => eq(u.slug, slugify(seedUniversity.shortName)),
    }));
  if (!universityRow) throw new Error("Failed to create or find university");

  const [prog] = await db
    .insert(program)
    .values({
      universityId: universityRow.id,
      name: seedProgram.name,
      slug: slugify(seedProgram.name),
    })
    .returning();

  const [br] = await db
    .insert(branch)
    .values({
      programId: prog.id,
      name: seedBranch.name,
      code: seedBranch.code,
      slug: slugify(seedBranch.name),
    })
    .returning();

  const [sch] = await db
    .insert(scheme)
    .values({
      branchId: br.id,
      name: seedScheme.name,
      year: seedScheme.year,
      isActive: true,
    })
    .returning();

  for (let semNumber = 1; semNumber <= 8; semNumber++) {
    const [sem] = await db
      .insert(semester)
      .values({ schemeId: sch.id, number: semNumber })
      .returning();

    const subjectsForSem = seedSubjects[semNumber];
    if (!subjectsForSem) continue;

    for (const subj of subjectsForSem) {
      const [subjectRow] = await db
        .insert(subject)
        .values({
          semesterId: sem.id,
          name: subj.name,
          code: subj.code,
          slug: slugify(`${subj.name}-${subj.code}`),
          credits: subj.credits,
        })
        .returning();

      await db.insert(topic).values(
        subj.topics.map((name, index) => ({
          subjectId: subjectRow.id,
          name,
          orderIndex: index,
        })),
      );

      console.log(`  seeded subject: ${subj.name} (${subj.code})`);
    }
  }

  // seed the one source every GTU-official resource will reference
  await db
    .insert(source)
    .values({
      type: "GTU_OFFICIAL",
      name: "GTU Official",
      baseUrl: "https://www.gtu.ac.in",
      isTrusted: true,
    })
    .onConflictDoNothing();

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});