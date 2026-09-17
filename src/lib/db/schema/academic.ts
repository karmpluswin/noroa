import { boolean, integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./_shared";

export const university = pgTable("university", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  slug: text("slug").notNull().unique(),
  ...timestamps,
});

export const program = pgTable("program", {
  id: uuid("id").defaultRandom().primaryKey(),
  universityId: uuid("university_id")
    .notNull()
    .references(() => university.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  ...timestamps,
});

export const branch = pgTable(
  "branch",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    programId: uuid("program_id")
      .notNull()
      .references(() => program.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("branch_program_slug_idx").on(t.programId, t.slug)],
);

export const scheme = pgTable(
  "scheme",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branch.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    year: integer("year").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [uniqueIndex("scheme_branch_year_idx").on(t.branchId, t.year)],
);

export const semester = pgTable(
  "semester",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    schemeId: uuid("scheme_id")
      .notNull()
      .references(() => scheme.id, { onDelete: "cascade" }),
    number: integer("number").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("semester_scheme_number_idx").on(t.schemeId, t.number)],
);

export const subject = pgTable(
  "subject",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    semesterId: uuid("semester_id")
      .notNull()
      .references(() => semester.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code").notNull(),
    slug: text("slug").notNull(),
    credits: integer("credits"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("subject_code_idx").on(t.code),
    uniqueIndex("subject_slug_idx").on(t.slug),
  ],
);

export const topic = pgTable(
  "topic",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("topic_subject_name_idx").on(t.subjectId, t.name)],
);

export const universityRelations = relations(university, ({ many }) => ({
  programs: many(program),
}));

export const programRelations = relations(program, ({ one, many }) => ({
  university: one(university, { fields: [program.universityId], references: [university.id] }),
  branches: many(branch),
}));

export const branchRelations = relations(branch, ({ one, many }) => ({
  program: one(program, { fields: [branch.programId], references: [program.id] }),
  schemes: many(scheme),
}));

export const schemeRelations = relations(scheme, ({ one, many }) => ({
  branch: one(branch, { fields: [scheme.branchId], references: [branch.id] }),
  semesters: many(semester),
}));

export const semesterRelations = relations(semester, ({ one, many }) => ({
  scheme: one(scheme, { fields: [semester.schemeId], references: [scheme.id] }),
  subjects: many(subject),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
  semester: one(semester, { fields: [subject.semesterId], references: [semester.id] }),
  topics: many(topic),
}));

export const topicRelations = relations(topic, ({ one }) => ({
  subject: one(subject, { fields: [topic.subjectId], references: [subject.id] }),
}));