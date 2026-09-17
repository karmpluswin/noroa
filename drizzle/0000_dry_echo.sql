CREATE TYPE "public"."report_status" AS ENUM('OPEN', 'ACTIONED', 'DISMISSED');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('PYQ', 'BOOK', 'VIDEO', 'PLAYLIST', 'NOTE', 'HANDWRITTEN_NOTE', 'SOLUTION', 'QUESTION_BANK', 'SYLLABUS');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('GTU_OFFICIAL', 'GTU_HOSTED', 'PERMISSIONED_REPO', 'TRUSTED_PUBLIC_REPO', 'GOOGLE_BOOKS', 'OPEN_LIBRARY', 'YOUTUBE', 'STUDENT_SUBMISSION', 'ADMIN_MANUAL');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'MERGED_DUPLICATE');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('PENDING_REVIEW', 'VERIFIED', 'REJECTED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "branch" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"university_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scheme" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"branch_id" uuid NOT NULL,
	"name" text NOT NULL,
	"year" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "semester" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheme_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"semester_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"slug" text NOT NULL,
	"credits" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subject_id" uuid NOT NULL,
	"name" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "university" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "university_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "resource_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"subject_id" uuid NOT NULL,
	"topic_id" uuid,
	"source_id" uuid NOT NULL,
	"canonical_url" text,
	"storage_key" text,
	"embed_id" text,
	"isbn" text,
	"author" text,
	"youtube_video_id" text,
	"verification_status" "verification_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"verified_by_user_id" text,
	"last_verified_at" timestamp with time zone,
	"last_link_check_at" timestamp with time zone,
	"link_is_healthy" boolean DEFAULT true NOT NULL,
	"exam_year" integer,
	"exam_season" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "source_type" NOT NULL,
	"name" text NOT NULL,
	"base_url" text,
	"is_trusted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"city" text,
	"state" text,
	"gtu_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"requested_name" text NOT NULL,
	"requested_by_user_id" text NOT NULL,
	"status" "verification_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"resolved_college_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "college_review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"author_user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"body" text NOT NULL,
	"status" "verification_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"college_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_report" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reported_by_user_id" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" "report_status" DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"moderator_user_id" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" uuid NOT NULL,
	"action" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paper_contribution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"contributed_by_user_id" text NOT NULL,
	"storage_key" text NOT NULL,
	"exam_year" integer NOT NULL,
	"status" "verification_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "viva_experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"college_id" uuid NOT NULL,
	"subject_id" uuid,
	"author_user_id" text NOT NULL,
	"body" text NOT NULL,
	"status" "verification_status" DEFAULT 'PENDING_REVIEW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "viva_question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viva_experience_id" uuid NOT NULL,
	"question" text NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_resource" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_by_user_id" text NOT NULL,
	"resource_type" "resource_type" NOT NULL,
	"subject_id" uuid NOT NULL,
	"title" text NOT NULL,
	"proposed_url" text,
	"storage_key" text,
	"status" "submission_status" DEFAULT 'PENDING' NOT NULL,
	"reviewed_by_user_id" text,
	"review_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "branch" ADD CONSTRAINT "branch_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "program" ADD CONSTRAINT "program_university_id_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."university"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheme" ADD CONSTRAINT "scheme_branch_id_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semester" ADD CONSTRAINT "semester_scheme_id_scheme_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."scheme"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subject" ADD CONSTRAINT "subject_semester_id_semester_id_fk" FOREIGN KEY ("semester_id") REFERENCES "public"."semester"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topic" ADD CONSTRAINT "topic_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource" ADD CONSTRAINT "resource_source_id_source_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."source"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_request" ADD CONSTRAINT "college_request_resolved_college_id_college_id_fk" FOREIGN KEY ("resolved_college_id") REFERENCES "public"."college"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "college_review" ADD CONSTRAINT "college_review_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_membership" ADD CONSTRAINT "community_membership_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_contribution" ADD CONSTRAINT "paper_contribution_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_contribution" ADD CONSTRAINT "paper_contribution_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viva_experience" ADD CONSTRAINT "viva_experience_college_id_college_id_fk" FOREIGN KEY ("college_id") REFERENCES "public"."college"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viva_experience" ADD CONSTRAINT "viva_experience_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viva_question" ADD CONSTRAINT "viva_question_viva_experience_id_viva_experience_id_fk" FOREIGN KEY ("viva_experience_id") REFERENCES "public"."viva_experience"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collection_id_collection_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collection"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_resource" ADD CONSTRAINT "saved_resource_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resource"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subject"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "branch_program_slug_idx" ON "branch" USING btree ("program_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "scheme_branch_year_idx" ON "scheme" USING btree ("branch_id","year");--> statement-breakpoint
CREATE UNIQUE INDEX "semester_scheme_number_idx" ON "semester" USING btree ("scheme_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "subject_code_idx" ON "subject" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "subject_slug_idx" ON "subject" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "topic_subject_name_idx" ON "topic" USING btree ("subject_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_isbn_idx" ON "resource" USING btree ("isbn");--> statement-breakpoint
CREATE UNIQUE INDEX "resource_youtube_video_idx" ON "resource" USING btree ("youtube_video_id");--> statement-breakpoint
CREATE UNIQUE INDEX "college_normalized_name_idx" ON "college" USING btree ("normalized_name");--> statement-breakpoint
CREATE UNIQUE INDEX "review_college_author_idx" ON "college_review" USING btree ("college_id","author_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "membership_user_college_idx" ON "community_membership" USING btree ("user_id","college_id");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_item_idx" ON "collection_item" USING btree ("collection_id","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_user_resource_idx" ON "saved_resource" USING btree ("user_id","resource_id");