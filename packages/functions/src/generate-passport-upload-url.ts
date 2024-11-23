import { GeneratePassportUploadUrlApiResponse } from '@borderless-passport-uploader/core/passport-parsing';
import { generateImageUploadUrl } from '@borderless-passport-uploader/core/s3';
import { extractUserFromAuthHeaders } from '@borderless-passport-uploader/core/auth';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const userId = extractUserFromAuthHeaders(event.headers);
  if (!userId) {
    return { statusCode: 401 };
  }

  const { imageId, uploadUrl } = await generateImageUploadUrl({ userId });

  return {
    imageId,
    uploadUrl,
  } satisfies GeneratePassportUploadUrlApiResponse;
};
