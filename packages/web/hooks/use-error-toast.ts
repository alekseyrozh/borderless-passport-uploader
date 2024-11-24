import { useEffect } from 'react';
import { toast } from 'sonner';

export const useErrorToast = ({
  error,
  userFriendlyErrorMessage,
}: {
  error: Error | null;
  userFriendlyErrorMessage: string;
}) => {
  useEffect(() => {
    if (error) {
      console.error(error.message);
      toast.error(userFriendlyErrorMessage);
    }
  }, [error]);
};
