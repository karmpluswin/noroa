import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subject, topic } from "./academic";
import { resourceTypeEnum, sourceTypeEnum, timestamps, verificationStatusEnum } from "./_shared";

export const source = pgTable("source", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: sourceTypeEnum("type").notNull(),
  name: text("name").notNull(),
  baseUrl: text("base_url"),
  isTrusted: boolean("is_trusted").notNull().default(false),
  ...timestamps,
});

export const resource = pgTable(
  "resource",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: resourceTypeEnum("type").notNull(),
    title: text("title").notNull(),
    description: text("description"),

    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subject.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id").references(() => topic.id, { onDelete: "set null" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => source.id, { onDelete: "restrict" }),

    // exactly one of these three is populated, enforced in app-layer validation
    canonicalUrl: text("canonical_url"),
    storageKey: text("storage_key"),
    embedId: text("embed_id"),

    // book-specific, nullable for non-book resources
    isbn: text("isbn"),
    author: text("author"),

    // video-specific
    youtubeVideoId: text("youtube_video_id"),

    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("PENDING_REVIEW"),
    verifiedByUserId: text("verified_by_user_id"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    lastLinkCheckAt: timestamp("last_link_check_at", { withTimezone: true }),
    linkIsHealthy: boolean("link_is_healthy").notNull().default(true),

    examYear: integer("exam_year"),
    examSeason: text("exam_season"),

    ...timestamps,
  },
  (t) => [
    uniqueIndex("resource_isbn_idx").on(t.isbn),
    uniqueIndex("resource_youtube_video_idx").on(t.youtubeVideoId),
  ],
);

export const sourceRelations = relations(source, ({ many }) => ({
  resources: many(resource),
}));

export const resourceRelations = relations(resource, ({ one }) => ({
  subject: one(subject, { fields: [resource.subjectId], references: [subject.id] }),
  topic: one(topic, { fields: [resource.topicId], references: [topic.id] }),
  source: one(source, { fields: [resource.sourceId], references: [source.id] }),
}));