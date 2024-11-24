import {
  AnalyzeIDCommand,
  AnalyzeIDCommandOutput,
  TextractClient,
} from '@aws-sdk/client-textract';
import { Resource } from 'sst/resource';
import { getDateParser } from '../passport-parsing/date-parsers';

export const textractIdentityDocument = async ({
  s3FileName,
}: {
  s3FileName: string;
}) => {
  const client = new TextractClient();
  const command = new AnalyzeIDCommand({
    DocumentPages: [
      {
        S3Object: {
          Bucket: Resource.Documents.name,
          Name: s3FileName,
        },
      },
    ],
  });

  const data = await client.send(command);

  return { data };
};
