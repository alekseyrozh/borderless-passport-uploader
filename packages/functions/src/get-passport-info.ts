import type { Handler } from 'aws-lambda';
import { z } from 'zod';

const getPassportInfoApiBodySchema = z.object({
  userId: z.string(),
  imageId: z.string(),
});

enum PassportProcessingStatus {
  UPLOADED = 'UPLOADED',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
}

const getPassportInfoApiResponseSchema = z.object({
  imageId: z.string(),
  processingStatus: z.nativeEnum(PassportProcessingStatus),
});

type GetPassportInfoApiResponse = z.infer<
  typeof getPassportInfoApiResponseSchema
>;

export const handler: Handler = async event => {
  const jsonBody = JSON.parse(event.body ?? '{}');
  const { userId, imageId } = getPassportInfoApiBodySchema.parse(jsonBody);

  return {
    imageId,
    processingStatus: PassportProcessingStatus.PROCESSED,
  } satisfies GetPassportInfoApiResponse;
};
