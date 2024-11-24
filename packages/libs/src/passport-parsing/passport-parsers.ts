import { AnalyzeIDCommandOutput } from '@aws-sdk/client-textract';
import { getDateParser } from './date-parsers';

export const extractDatesFromDocument = ({
  documentData,
}: {
  documentData: AnalyzeIDCommandOutput;
}) => {
  if (!(documentData?.IdentityDocuments?.length === 1)) {
    throw new Error(
      `Expected 1 identity document but got ${documentData?.IdentityDocuments?.length}`,
    );
  }
  const document = documentData?.IdentityDocuments[0];
  if (!document.IdentityDocumentFields) {
    throw new Error('No IdentityDocumentFields found');
  }

  // extract the fields we need
  const expirationDate = document.IdentityDocumentFields.filter(
    field => field.Type?.Text === 'EXPIRATION_DATE',
  );
  const dateOfBirth = document.IdentityDocumentFields.filter(
    field => field.Type?.Text === 'DATE_OF_BIRTH',
  );
  const mrzCode = document.IdentityDocumentFields.filter(
    field => field.Type?.Text === 'MRZ_CODE',
  );

  const allFields = [expirationDate, dateOfBirth, mrzCode];
  allFields.forEach(field => {
    if (field.length !== 1) {
      throw new Error(`Expected 1 field but got ${field.length}`);
    }
  });

  // validate confidence level of the fields
  const confidenceAcceptanceThreshold = 0.5;
  allFields.find(field => {
    if (
      !field[0].ValueDetection?.Confidence ||
      field[0].ValueDetection?.Confidence < confidenceAcceptanceThreshold
    ) {
      throw new Error(
        `Confidence level is below threshold. Field: ${field[0].Type?.Text}. Value ${field[0].ValueDetection?.Text} .Level: ${field[0].ValueDetection?.Confidence}. Threshold: ${confidenceAcceptanceThreshold}`,
      );
    }
  });

  // parse the dates
  const dateParser = getDateParser({
    mrzCode: mrzCode[0].ValueDetection?.Text!,
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

  return parsedData;
};
