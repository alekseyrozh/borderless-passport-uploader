import { getDateParser } from '@borderless-passport-uploader/core/passport-parsing';
import { constructS3FileName } from '@borderless-passport-uploader/core/s3';
import { textractIdentityDocument } from '@borderless-passport-uploader/core/textract';
import type { Handler } from 'aws-lambda';
import { z } from 'zod';

const requestSchema = z.object({
  userId: z.string(),
  imageId: z.string(),
});

export const handler: Handler = async event => {
  const jsonBody = JSON.parse(event.body ?? '{}');
  const { userId, imageId } = requestSchema.parse(jsonBody);

  const identityDocumentData = await textractIdentityDocument({
    s3FileName: constructS3FileName({ userId, imageId }),
  });

  if (!(identityDocumentData.data?.IdentityDocuments?.length === 1)) {
    throw new Error(
      `Expected 1 identity document but got ${identityDocumentData.data?.IdentityDocuments?.length}`,
    );
  }
  const document = identityDocumentData.data?.IdentityDocuments[0];

  if (!document.IdentityDocumentFields) {
    throw new Error('No IdentityDocumentFields found');
  }

  const expirationDate = document.IdentityDocumentFields.filter(
    a => a.Type?.Text === 'EXPIRATION_DATE',
  );
  const dateOfBirth = document.IdentityDocumentFields.filter(
    a => a.Type?.Text === 'DATE_OF_BIRTH',
  );
  const mrzCode = document.IdentityDocumentFields.filter(
    a => a.Type?.Text === 'MRZ_CODE',
  );

  const dateParser = getDateParser({
    mrzCode: mrzCode[0].ValueDetection?.Text!,
  });

  const allFields = [expirationDate, dateOfBirth, mrzCode];

  allFields.forEach(field => {
    if (field.length !== 1) {
      throw new Error(`Expected 1 field but got ${field.length}`);
    }
  });

  const confidenceAcceptanceThreshold = 0.8;
  allFields.find(field => {
    if (
      !field[0].ValueDetection?.Confidence ||
      field[0].ValueDetection?.Confidence < confidenceAcceptanceThreshold
    ) {
      throw new Error(
        `Confidence level is below threshold. Level: ${field[0].ValueDetection?.Confidence}. Threshold: ${confidenceAcceptanceThreshold}`,
      );
    }
  });

  const parsedData = {
    expirationDate: {
      value: dateParser(expirationDate[0].ValueDetection?.Text!),
      originalText: expirationDate[0].ValueDetection?.Text!,
    },
    dateOfBirth: {
      value: dateParser(dateOfBirth[0].ValueDetection?.Text!),
      originalText: dateOfBirth[0].ValueDetection?.Text!,
    },
  };

  return {
    imageId,
    data: parsedData,
  };
};
