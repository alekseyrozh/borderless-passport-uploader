import { generateImageUploadUrl } from '@borderless-passport-uploader/core/s3';
import type { Handler } from 'aws-lambda';
import { z } from 'zod';

const requestSchema = z.object({
  userId: z.string(),
});

export const handler: Handler = async event => {
  const jsonBody = JSON.parse(event.body ?? '{}');
  const { userId } = requestSchema.parse(jsonBody);
  const { imageId, uploadUrl } = await generateImageUploadUrl({ userId });

  return {
    imageId,
    uploadUrl,
  };
};
