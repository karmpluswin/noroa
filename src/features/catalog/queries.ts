import { db } from "@/lib/db";
import { branch, program, scheme, semester, subject, topic, university } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getActiveUniversityTree() {
  return db.query.university.findFirst({
    with: {
      programs: {
        with: {
          branches: {
            with: {
              schemes: {
                where: (s, { eq }) => eq(s.isActive, true),
                with: {
                  semesters: {
                    orderBy: (s, { asc }) => asc(s.number),
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getSubjectsBySemesterId(semesterId: string) {
  return db.query.subject.findMany({
    where: eq(subject.semesterId, semesterId),
    orderBy: asc(subject.name),
  });
}

export async function getSubjectBySlug(slug: string) {
  return db.query.subject.findFirst({
    where: eq(subject.slug, slug),
    with: {
      topics: {
        orderBy: (t, { asc }) => asc(t.orderIndex),
      },
      semester: {
        with: {
          scheme: {
            with: {
              branch: true,
            },
          },
        },
      },
    },
  });
}

export async function listAllSubjects() {
  return db
    .select({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      slug: subject.slug,
      semesterNumber: semester.number,
      branchName: branch.name,
    })
    .from(subject)
    .innerJoin(semester, eq(subject.semesterId, semester.id))
    .innerJoin(scheme, eq(semester.schemeId, scheme.id))
    .innerJoin(branch, eq(scheme.branchId, branch.id))
    .orderBy(asc(subject.name));
}