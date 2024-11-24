import { API_BASE_URL } from '@/utils/constants';
import { zodFetcher } from '@/utils/zod-fetch';
import {
  AcceptedImageMimeType,
  GeneratePassportUploadUrlApiBody,
  generatePassportUploadUrlApiResponseSchema,
} from '@borderless-passport-uploader/libs/passport-parsing/client';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useErrorToast } from './use-error-toast';

export const useGeneratePassportUploadUrl = () => {
  const { getToken } = useAuth();

  const mutationResult = useMutation({
    mutationKey: ['generate-passport-upload-url'],
    mutationFn: async ({
      fileMimeType,
    }: {
      fileMimeType: AcceptedImageMimeType;
    }) =>
      zodFetcher(
        generatePassportUploadUrlApiResponseSchema,
        `${API_BASE_URL}/generate-passport-upload-url`,
        {
          body: JSON.stringify({
            fileMimeType: fileMimeType,
          } satisfies GeneratePassportUploadUrlApiBody),
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      ),
  });

  useErrorToast({
    error: mutationResult.error,
    userFriendlyErrorMessage: 'Error generating upload url',
  });

  return mutationResult;
};
