import mime from 'mime-types';

export const mimeToExtension = (mimeType: string) => {
  const extension = mime.extension(mimeType);

  if (!extension) {
    throw new Error(`Unknown mime type: ${mimeType}`);
  }

  return extension;
};
