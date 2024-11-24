import { extractUserFromAuthHeaders } from '@borderless-passport-uploader/libs/auth/server';
import {
  getPassportImageDataFromDb,
  GetPassportInfoApiResponse,
} from '@borderless-passport-uploader/libs/passport-parsing/server';
import { getDb } from '@borderless-passport-uploader/libs/postgress/server';
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const userId = extractUserFromAuthHeaders(event.headers);
  if (!userId) {
    return { statusCode: 401 };
  }

  const imageId = event.queryStringParameters?.imageId;
  if (!imageId) {
    return { statusCode: 400 };
  }

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
    dateOfBirth: passportImageFromDb.dateOfBirth
      ? dateToDateString(passportImageFromDb.dateOfBirth)
      : null,
    expirationDate: passportImageFromDb.expirationDate
      ? dateToDateString(passportImageFromDb.expirationDate)
      : null,
  } satisfies GetPassportInfoApiResponse;
};

const dateToDateString = (date: Date) => {
  const dateStr = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return dateStr;
};
