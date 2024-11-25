import { secrets } from './secrets';
import { documentsBucket } from './storage';

export const documentApi = new sst.aws.ApiGatewayV2('DocumentApi');

documentApi.route('POST /generate-passport-upload-url', {
  handler: 'packages/lambdas/src/generate-passport-upload-url.handler',
  link: [documentsBucket],
});

documentApi.route('GET /passport-info', {
  handler: 'packages/lambdas/src/get-passport-info.handler',
  link: [
    documentsBucket,
    secrets.NeonDbBorderlessPassportUploaderConnectionString,
  ],
});
