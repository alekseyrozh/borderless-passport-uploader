import {
  extractDatesFromDocument,
  markPassportImageAsErroredInDb,
  markPassportImageAsProcessedInDb,
  PassportProcessingStatus,
  savePassportImageToDb,
} from '@borderless-passport-uploader/libs/passport-parsing/server';
import { getDb } from '@borderless-passport-uploader/libs/postgress/server';
import { parseS3FileName } from '@borderless-passport-uploader/libs/s3/server';
import { textractIdentityDocument } from '@borderless-passport-uploader/libs/textract/server';
import type { S3Handler } from 'aws-lambda';

export const handler: S3Handler = async event => {
  console.log('event', event);

  const db = getDb();

  for (const record of event.Records) {
    const s3FileName = record.s3.object.key;
    const { userId, imageId } = parseS3FileName(s3FileName);

    try {
      await savePassportImageToDb({
        db,
        imageId,
        userId,
        processingStatus: PassportProcessingStatus.UPLOADED,
      });

      const identityDocumentData = await textractIdentityDocument({
        s3FileName,
      });

      const parsedDates = extractDatesFromDocument({
        documentData: identityDocumentData.data,
      });

      await markPassportImageAsProcessedInDb({
        db,
        imageId,
        userId,
        dateOfBirth: parsedDates.dateOfBirth.value,
        expirationDate: parsedDates.expirationDate.value,
        rawTextractData: JSON.stringify(identityDocumentData),
      });
    } catch (e) {
      await markPassportImageAsErroredInDb({
        db,
        imageId,
        userId,
      });

      console.error('Error processing record', record, e);
    }
  }
};
