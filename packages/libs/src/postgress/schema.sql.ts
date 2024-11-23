import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { ALL_PASSPORT_PROCESSING_STATUSES } from '../passport-parsing/types/domain';

export const passportProcessingStatusEnum = pgEnum(
  'passport_processing_status',
  ALL_PASSPORT_PROCESSING_STATUSES,
);

export const images = pgTable('images', {
  imageId: uuid('image_id').primaryKey().notNull(),
  userId: text('user_id').notNull(),
  processingStatus: passportProcessingStatusEnum('processing_status').notNull(),
  createdAt: timestamp('created_at').notNull(),
  dateOfBirth: date('date_of_birth', { mode: 'date' }),
  expirationDate: date('expiration_date', { mode: 'date' }),
  rawTextractData: text('raw_textract_data'),
});
