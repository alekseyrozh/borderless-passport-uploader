export enum ScreenState {
  SELECTING_IMAGE = 'SELECTING_IMAGE',
  IMAGE_UPLOADING = 'IMAGE_UPLOADING',
  IMAGE_PROCESSING = 'IMAGE_PROCESSING',
  IMAGE_PROCESSED = 'IMAGE_PROCESSED',
  ERROR = 'ERROR',
}

export const isLoadingState = (screenState: ScreenState) => {
  return (
    screenState === ScreenState.IMAGE_UPLOADING ||
    screenState === ScreenState.IMAGE_PROCESSING
  );
};
