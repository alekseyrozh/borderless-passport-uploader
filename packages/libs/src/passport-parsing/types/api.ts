import { z } from 'zod';
import { PassportProcessingStatus } from './domain';

// Get passport info
export const getPassportInfoApiBodySchema = z.object({
  imageId: z.string(),
});

export const getPassportInfoApiResponseSchema = z.object({
  imageId: z.string(),
  processingStatus: z.nativeEnum(PassportProcessingStatus),
});
export type GetPassportInfoApiResponse = z.infer<
  typeof getPassportInfoApiResponseSchema
>;

// Generate passport upload URL
export const generatePassportUploadUrlApiResponseSchema = z.object({
  imageId: z.string(),
  uploadUrl: z.string(),
});
export type GeneratePassportUploadUrlApiResponse = z.infer<
  typeof generatePassportUploadUrlApiResponseSchema
>;
