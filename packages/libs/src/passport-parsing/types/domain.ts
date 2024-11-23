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
