import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { subject } from "./academic";
import { resourceTypeEnum, submissionStatusEnum, timestamps } from "./_shared";

export const submission = pgTable("submission", {
  id: uuid("id").defaultRandom().primaryKey(),
  submittedByUserId: text("submitted_by_user_id").notNull(),
  resourceType: resourceTypeEnum("resource_type").notNull(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  proposedUrl: text("proposed_url"),
  storageKey: text("storage_key"),
  status: submissionStatusEnum("status").notNull().default("PENDING"),
  reviewedByUserId: text("reviewed_by_user_id"),
  reviewNote: text("review_note"),
  ...timestamps,
});