/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'borderless-passport-uploader',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'eu-west-1',
        },
      },
    };
  },
  async run() {
    await import('./infra/secrets');
    await import('./infra/storage');
    await import('./infra/passport-processing');
    const { documentApi } = await import('./infra/api');

    return {
      api: documentApi.url,
    };
  },
});
