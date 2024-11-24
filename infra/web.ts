import { documentApi } from './api';

export const web = new sst.aws.Nextjs('Web', {
  path: 'packages/web',
  environment: {
    NEXT_PUBLIC_API_BASE_URL: documentApi.url,
  },
});
