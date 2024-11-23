import { bucket } from './storage';

export const documentApi = new sst.aws.ApiGatewayV2('DocumentApi');

documentApi.route('POST /generate-passport-upload-url', {
  handler: 'packages/functions/src/generate-passport-upload-url.handler',
  link: [bucket],
});

// TODO: react to changes in a bucket
documentApi.route('POST /trigger-textract', {
  handler: 'packages/functions/src/trigger-textract.handler',
  link: [bucket],
  permissions: [
    {
      actions: ['textract:*'],
      resources: ['*'],
    },
  ],
});

documentApi.route('GET /passport-info', {
  handler: 'packages/functions/src/get-passport-info.handler',
  link: [bucket],
});
