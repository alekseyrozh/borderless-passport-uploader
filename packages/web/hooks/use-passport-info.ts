import { API_BASE_URL } from '@/utils/constants';
import { HttpError, zodFetcher } from '@/utils/zod-fetch';
import {
  GetPassportInfoApiResponse,
  getPassportInfoApiResponseSchema,
} from '@borderless-passport-uploader/libs/passport-parsing/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { useErrorToast } from './use-error-toast';

export const usePassportInfo = ({
  imageId,
  enabled,
  shouldPoll,
}: {
  imageId: string | undefined;
  enabled: boolean;
  shouldPoll: (queryResult: GetPassportInfoApiResponse | undefined) => boolean;
}) => {
  const { getToken } = useAuth();

  const queryResult = useQuery({
    queryKey: ['passport-info', { imageId }],
    queryFn: async () =>
      zodFetcher(
        getPassportInfoApiResponseSchema,
        `${API_BASE_URL}/passport-info?imageId=${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        },
      ).catch(error => {
        if (isNotFoundError(error)) {
          console.log('Passport info not found which is an expected state');
        }
        throw error;
      }),
    refetchInterval: query => (shouldPoll(query.state.data) ? 3000 : false),
    enabled,
  });

  useErrorToast({
    error: isNotFoundError(queryResult.error) ? null : queryResult.error,
    userFriendlyErrorMessage: 'Error fetching passport info',
  });

  return queryResult;
};

const isNotFoundError = (error: any) => {
  return error instanceof HttpError && error.status === 404;
};
