import {
  generatePassportUploadUrlApiBodySchema,
  GeneratePassportUploadUrlApiResponse,
} from '@borderless-passport-uploader/libs/passport-parsing/server';
import { generateImageUploadUrl } from '@borderless-passport-uploader/libs/s3/server';
import { extractUserFromAuthHeaders } from '@borderless-passport-uploader/libs/auth/server';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const userId = extractUserFromAuthHeaders(event.headers);
  if (!userId) {
    return { statusCode: 401 };
  }

  const jsonBody = JSON.parse(event.body ?? '{}');
  const { fileMimeType } =
    generatePassportUploadUrlApiBodySchema.parse(jsonBody);

  const { imageId, uploadUrl } = await generateImageUploadUrl({
    userId,
    fileMimeType,
  });

  return {
    imageId,
    uploadUrl,
  } satisfies GeneratePassportUploadUrlApiResponse;
};
