'use client';

import { useGeneratePassportUploadUrl } from '@/hooks/use-generate-passport-upload-url';
import { usePassportInfo } from '@/hooks/use-passport-info';
import { useUploadPassportImage } from '@/hooks/use-upload-passport-image';
import { SelectedFile } from '@/types/selected-file';
import { mapToScreenState } from '@/utils/state-mapper';
import {
  AcceptedImageMimeType,
  isTerminalProcessingStatus,
  PassportProcessingStatus,
} from '@borderless-passport-uploader/libs/passport-parsing/client';
import { useState } from 'react';
import { FileSelector } from './file-selector';
import { isLoadingState, ScreenState } from '@/types/screen-state';
import { ActionButton } from './action-button';

export const PassportDatesExtractor = () => {
  const [selectedImages, setSelectedImages] = useState<SelectedFile[]>([]);
  const [imageId, setImageId] = useState<string>();
  const {
    mutateAsync: generatePassportUploadUrlAsync,
    isPending: generatingUploadUrl,
    reset: resetGeneratePassportUploadUrl,
  } = useGeneratePassportUploadUrl();
  const {
    mutateAsync: uploadPassportImageAsync,
    isSuccess: passportImageUploaded,
    reset: resetUploadPassportImage,
  } = useUploadPassportImage();

  const { data: passportInfo } = usePassportInfo({
    imageId,
    enabled: !!imageId && passportImageUploaded,
    shouldPoll: passportInfo =>
      !passportInfo ||
      !isTerminalProcessingStatus(passportInfo.processingStatus),
  });

  const screenState = mapToScreenState({
    imageId,
    passportImageUploaded,
    generatingUploadUrl,
    passportProcessingStatus: passportInfo?.processingStatus,
  });

  const processImage = async (file: File) => {
    const { imageId, uploadUrl } = await generatePassportUploadUrlAsync({
      fileMimeType: file.type as AcceptedImageMimeType, // casting is ok because we constrain accepted mime types in the FileSelector component
    });

    setImageId(imageId);
    await uploadPassportImageAsync({ file, uploadUrl });
  };

  const onSelectedFilesChanged = (files: SelectedFile[]) => {
    setImageId(undefined);
    resetGeneratePassportUploadUrl();
    resetUploadPassportImage();
    setSelectedImages(files);
  };

  return (
    <div className="flex flex-col items-center my-20">
      <h1 className="text-7xl font-normal text-dark-brand font-[family-name:var(--font-playfair-display)] text-center text-balance">
        Borderless passport uploader
      </h1>
      <p className="text-xl text-dark-brand mt-8 text-center text-balance">
        Extract key dates from your documents with ease
      </p>
      <div className="w-[600px] max-w-full px-5 mt-24">
        <FileSelector
          onSelectedFilesChanged={onSelectedFilesChanged}
          selectedFiles={selectedImages}
          disabled={screenState !== ScreenState.SELECTING_IMAGE}
        />
        {selectedImages.length > 0 && (
          <ActionButton
            screenState={screenState}
            onClick={() => {
              if (screenState === ScreenState.SELECTING_IMAGE) {
                processImage(selectedImages[0].file);
              } else if (!isLoadingState(screenState)) {
                onSelectedFilesChanged([]);
              }
            }}
          />
        )}
      </div>
      {passportInfo?.processingStatus ===
        PassportProcessingStatus.PROCESSED && (
        <SuccessElements
          dateOfBirth={passportInfo.dateOfBirth!}
          expirationDate={passportInfo.expirationDate!}
        />
      )}

      {passportInfo?.processingStatus === PassportProcessingStatus.ERROR && (
        <ErrorElements />
      )}
    </div>
  );
};

const SuccessElements = ({
  dateOfBirth,
  expirationDate,
}: {
  dateOfBirth: string;
  expirationDate: string;
}) => {
  return (
    <div className="flex flex-col uppercase font-[family-name:var(--font-geist-mono)] mt-10">
      <div className="flex flex-row">
        <p className="min-w-[180px]">date of birth</p>
        <p> {dateOfBirth}</p>
      </div>
      <div className="flex flex-row">
        <p className="min-w-[180px]">expiration date</p>
        <p> {expirationDate}</p>
      </div>
    </div>
  );
};

const ErrorElements = () => {
  return (
    <p className="text-red-500 font-[family-name:var(--font-geist-mono)] mt-2">
      This didn't work. Please try again with a better image.
    </p>
  );
};
