import { createZodFetcher } from 'zod-fetch';

export class HttpError extends Error {
  readonly status;

  constructor(status: number, message?: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

// so that error codes are not swallawed and you can .catch() them, can be removed once my pull request is accepted - https://github.com/mattpocock/zod-fetch/issues/12
export const zodFetcher = createZodFetcher(
  (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) =>
    fetch(input, init).then(response => {
      if (!response.ok) {
        throw new HttpError(
          response.status,
          `Request failed with status ${response.status}`,
        );
      }

      return response.json();
    }),
);
