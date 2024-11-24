import { z } from 'zod';
import { ACCEPTED_IMAGE_MIME_TYPES, PassportProcessingStatus } from './domain';

// Get passport info
export const getPassportInfoApiResponseSchema = z.object({
  imageId: z.string(),
  processingStatus: z.nativeEnum(PassportProcessingStatus),
});
export type GetPassportInfoApiResponse = z.infer<
  typeof getPassportInfoApiResponseSchema
>;

// Generate passport upload URL
export const generatePassportUploadUrlApiBodySchema = z.object({
  fileMimeType: z.enum(ACCEPTED_IMAGE_MIME_TYPES),
});
export type GeneratePassportUploadUrlApiBody = z.infer<
  typeof generatePassportUploadUrlApiBodySchema
>;

export const generatePassportUploadUrlApiResponseSchema = z.object({
  imageId: z.string(),
  uploadUrl: z.string(),
});
export type GeneratePassportUploadUrlApiResponse = z.infer<
  typeof generatePassportUploadUrlApiResponseSchema
>;
