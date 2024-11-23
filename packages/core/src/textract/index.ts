import { AnalyzeIDCommand, TextractClient } from '@aws-sdk/client-textract';
import { Resource } from 'sst/resource';

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
          Bucket: Resource.MyBucket.name,
          Name: s3FileName,
        },
      },
    ],
  });

  const data = await client.send(command);

  return { data };
};
