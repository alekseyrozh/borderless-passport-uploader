import {
  getDateParser,
  markPassportImageAsErroredInDb,
  markPassportImageAsProcessedInDb,
  PassportProcessingStatus,
  savePassportImageToDb,
} from '@borderless-passport-uploader/libs/passport-parsing';
import { getDb } from '@borderless-passport-uploader/libs/postgress';
import { parseS3FileName } from '@borderless-passport-uploader/libs/s3';
import { textractIdentityDocument } from '@borderless-passport-uploader/libs/textract';
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

      console.log('parsedData', parsedData);
      await markPassportImageAsProcessedInDb({
        db,
        imageId,
        userId,
        dateOfBirth: parsedData.dateOfBirth.value,
        expirationDate: parsedData.expirationDate.value,
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
