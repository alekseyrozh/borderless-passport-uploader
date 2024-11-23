import { extractUserFromAuthHeaders } from '@borderless-passport-uploader/core/auth';
import {
  getPassportImageDataFromDb,
  getPassportInfoApiBodySchema,
  GetPassportInfoApiResponse,
} from '@borderless-passport-uploader/core/passport-parsing';
import { getDb } from '@borderless-passport-uploader/core/postgress';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const userId = extractUserFromAuthHeaders(event.headers);
  if (!userId) {
    return { statusCode: 401 };
  }

  const jsonBody = JSON.parse(event.body ?? '{}');
  const { imageId } = getPassportInfoApiBodySchema.parse(jsonBody);

  const db = getDb();

  const passportImageFromDb = await getPassportImageDataFromDb({
    db,
    imageId,
    userId,
  });

  if (!passportImageFromDb) {
    return { statusCode: 404 };
  }

  return {
    imageId,
    processingStatus: passportImageFromDb.processingStatus,
  } satisfies GetPassportInfoApiResponse;
};
