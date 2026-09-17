import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subject } from "./academic";
import { reportStatusEnum, timestamps, verificationStatusEnum } from "./_shared";

export const college = pgTable(
  "college",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    city: text("city"),
    state: text("state"),
    gtuCode: text("gtu_code"),
    ...timestamps,
  },
  (t) => [uniqueIndex("college_normalized_name_idx").on(t.normalizedName)],
);

export const collegeRequest = pgTable("college_request", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestedName: text("requested_name").notNull(),
  requestedByUserId: text("requested_by_user_id").notNull(),
  status: verificationStatusEnum("status").notNull().default("PENDING_REVIEW"),
  resolvedCollegeId: uuid("resolved_college_id").references(() => college.id, {
    onDelete: "set null",
  }),
  ...timestamps,
});

export const communityMembership = pgTable(
  "community_membership",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => college.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("membership_user_college_idx").on(t.userId, t.collegeId)],
);

export const paperContribution = pgTable("paper_contribution", {
  id: uuid("id").defaultRandom().primaryKey(),
  collegeId: uuid("college_id")
    .notNull()
    .references(() => college.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  contributedByUserId: text("contributed_by_user_id").notNull(),
  storageKey: text("storage_key").notNull(),
  examYear: integer("exam_year").notNull(),
  status: verificationStatusEnum("status").notNull().default("PENDING_REVIEW"),
  ...timestamps,
});

export const vivaExperience = pgTable("viva_experience", {
  id: uuid("id").defaultRandom().primaryKey(),
  collegeId: uuid("college_id")
    .notNull()
    .references(() => college.id, { onDelete: "cascade" }),
  subjectId: uuid("subject_id").references(() => subject.id, { onDelete: "set null" }),
  authorUserId: text("author_user_id").notNull(),
  body: text("body").notNull(),
  status: verificationStatusEnum("status").notNull().default("PENDING_REVIEW"),
  ...timestamps,
});

export const vivaQuestion = pgTable("viva_question", {
  id: uuid("id").defaultRandom().primaryKey(),
  vivaExperienceId: uuid("viva_experience_id")
    .notNull()
    .references(() => vivaExperience.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  ...timestamps,
});

export const collegeReview = pgTable(
  "college_review",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    collegeId: uuid("college_id")
      .notNull()
      .references(() => college.id, { onDelete: "cascade" }),
    authorUserId: text("author_user_id").notNull(),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    status: verificationStatusEnum("status").notNull().default("PENDING_REVIEW"),
    ...timestamps,
  },
  (t) => [uniqueIndex("review_college_author_idx").on(t.collegeId, t.authorUserId)],
);

export const communityReport = pgTable("community_report", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportedByUserId: text("reported_by_user_id").notNull(),
  targetTable: text("target_table").notNull(),
  targetId: uuid("target_id").notNull(),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").notNull().default("OPEN"),
  ...timestamps,
});

export const moderationAction = pgTable("moderation_action", {
  id: uuid("id").defaultRandom().primaryKey(),
  moderatorUserId: text("moderator_user_id").notNull(),
  targetTable: text("target_table").notNull(),
  targetId: uuid("target_id").notNull(),
  action: text("action").notNull(),
  note: text("note"),
  ...timestamps,
});

export const collegeRelations = relations(college, ({ many }) => ({
  memberships: many(communityMembership),
  paperContributions: many(paperContribution),
  vivaExperiences: many(vivaExperience),
  reviews: many(collegeReview),
}));

export const communityMembershipRelations = relations(communityMembership, ({ one }) => ({
  college: one(college, { fields: [communityMembership.collegeId], references: [college.id] }),
}));

export const paperContributionRelations = relations(paperContribution, ({ one }) => ({
  college: one(college, { fields: [paperContribution.collegeId], references: [college.id] }),
  subject: one(subject, { fields: [paperContribution.subjectId], references: [subject.id] }),
}));

export const vivaExperienceRelations = relations(vivaExperience, ({ one, many }) => ({
  college: one(college, { fields: [vivaExperience.collegeId], references: [college.id] }),
  subject: one(subject, { fields: [vivaExperience.subjectId], references: [subject.id] }),
  questions: many(vivaQuestion),
}));

export const vivaQuestionRelations = relations(vivaQuestion, ({ one }) => ({
  vivaExperience: one(vivaExperience, {
    fields: [vivaQuestion.vivaExperienceId],
    references: [vivaExperience.id],
  }),
}));

export const collegeReviewRelations = relations(collegeReview, ({ one }) => ({
  college: one(college, { fields: [collegeReview.collegeId], references: [college.id] }),
}));