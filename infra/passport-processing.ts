import { secrets } from './secrets';
import { documentsBucket } from './storage';

documentsBucket.subscribe(
  {
    handler: 'packages/lambdas/src/process-passport-image.handler',
    name: 'ProcessPassportImage',
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
