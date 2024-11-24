export enum PassportProcessingStatus {
  UPLOADED = 'UPLOADED',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
}

export const ALL_PASSPORT_PROCESSING_STATUSES = [
  PassportProcessingStatus.UPLOADED,
  PassportProcessingStatus.PROCESSED,
  PassportProcessingStatus.ERROR,
] as const;

export const isTerminalProcessingStatus = (
  status: PassportProcessingStatus,
): boolean => {
  return (
    status === PassportProcessingStatus.PROCESSED ||
    status === PassportProcessingStatus.ERROR
  );
};

export const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'] as const;
export type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number];
