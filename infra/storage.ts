import { secrets } from './secrets';

export const documentsBucket = new sst.aws.Bucket('Documents');

documentsBucket.subscribe(
  {
    handler: 'packages/lambdas/src/process-passport-image.handler',
    name: `${$app.name}-${$app.stage}-ProcessPassportImage`,
    link: [
      documentsBucket,
      secrets.NeonDbBorderlessPassportUploaderConnectionString,
    ],
    permissions: [
      {
        actions: ['textract:*'],
        resources: ['*'],
      },
    ],
  },
  {
    events: ['s3:ObjectCreated:*'],
  },
);
