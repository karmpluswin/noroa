import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const resourceTypeEnum = pgEnum("resource_type", [
  "PYQ",
  "BOOK",
  "VIDEO",
  "PLAYLIST",
  "NOTE",
  "HANDWRITTEN_NOTE",
  "SOLUTION",
  "QUESTION_BANK",
  "SYLLABUS",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING_REVIEW",
  "VERIFIED",
  "REJECTED",
  "ARCHIVED",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "GTU_OFFICIAL",
  "GTU_HOSTED",
  "PERMISSIONED_REPO",
  "TRUSTED_PUBLIC_REPO",
  "GOOGLE_BOOKS",
  "OPEN_LIBRARY",
  "YOUTUBE",
  "STUDENT_SUBMISSION",
  "ADMIN_MANUAL",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "MERGED_DUPLICATE",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "OPEN",
  "ACTIONED",
  "DISMISSED",
]);

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};