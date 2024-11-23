CREATE TYPE "public"."passport_processing_status" AS ENUM('UPLOADED', 'PROCESSED', 'ERROR');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"image_id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"processing_status" "passport_processing_status" NOT NULL,
	"created_at" timestamp NOT NULL,
	"date_of_birth" date,
	"exparation_date" date,
	"raw_textract_data" text
);
