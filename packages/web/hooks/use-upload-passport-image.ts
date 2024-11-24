import { useMutation } from '@tanstack/react-query';
import { useErrorToast } from './use-error-toast';

export const useUploadPassportImage = () => {
  const mutationResult = useMutation({
    mutationKey: ['upload-passport-image'],
    mutationFn: async ({
      file,
      uploadUrl,
    }: {
      file: File;
      uploadUrl: string;
    }) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async event => {
          const fileData = event.target?.result;
          if (fileData) {
            const body = new Blob([fileData], { type: file.type });

            try {
              await fetch(uploadUrl, {
                body,
                method: 'PUT',
              });
              resolve();
            } catch (error) {
              reject(new Error('Failed to upload file'));
            }
          }
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsArrayBuffer(file);
      });
    },
  });

  useErrorToast({
    error: mutationResult.error,
    userFriendlyErrorMessage: 'Error uploading passport image',
  });

  return mutationResult;
};
