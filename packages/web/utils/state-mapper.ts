import { ScreenState } from '@/types/screen-state';
import { PassportProcessingStatus } from '@borderless-passport-uploader/libs/passport-parsing/client';

export const mapToScreenState = ({
  imageId,
  passportImageUploaded,
  generatingUploadUrl,
  passportProcessingStatus,
}: {
  imageId: string | undefined;
  passportImageUploaded: boolean;
  generatingUploadUrl: boolean;
  passportProcessingStatus: PassportProcessingStatus | undefined;
}) => {
  if (!imageId && !generatingUploadUrl) {
    return ScreenState.SELECTING_IMAGE;
  }
  if (!passportImageUploaded) {
    return ScreenState.IMAGE_UPLOADING;
  }
  if (passportProcessingStatus === PassportProcessingStatus.PROCESSED) {
    return ScreenState.IMAGE_PROCESSED;
  }
  if (passportProcessingStatus === PassportProcessingStatus.ERROR) {
    return ScreenState.ERROR;
  }
  return ScreenState.IMAGE_PROCESSING;
};
