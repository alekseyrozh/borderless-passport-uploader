import { SelectedFile } from '@/types/selected-file';
import { ACCEPTED_IMAGE_MIME_TYPES } from '@borderless-passport-uploader/libs/passport-parsing/client';
import { CloudUpload, Trash2 } from 'lucide-react';
import prettyBytes from 'pretty-bytes';
import { useEffect } from 'react';
import { ErrorCode, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

// 2mb
const MAX_FILE_SIZE_BYTES = 1000 * 1000 * 2; // not *1024, huh? How come does prettyBytes use 1000 instead of 1024?

// heavily inspired by https://preline.co/docs/file-upload.html
export const FileSelector = ({
  disabled,
  onSelectedFilesChanged,
  selectedFiles,
}: {
  disabled: boolean;
  onSelectedFilesChanged: (selectedFiles: SelectedFile[]) => void;
  selectedFiles: SelectedFile[];
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: ACCEPTED_IMAGE_MIME_TYPES.reduce(
      (acc, fileType) => ({ ...acc, [fileType]: [] }),
      {},
    ),
    multiple: false,
    maxSize: MAX_FILE_SIZE_BYTES,
    onDrop: acceptedFiles => {
      onSelectedFilesChanged(
        acceptedFiles.map(file => ({
          previewUrl: URL.createObjectURL(file),
          file,
        })),
      );
    },
    onDropRejected: rejectedFiles => {
      rejectedFiles.forEach(file => {
        file.errors.forEach(error => {
          toast.error(getErrorMessage(error.code));
        });
      });
      console.warn(rejectedFiles);
    },
  });

  const clearAll = () => {
    onSelectedFilesChanged([]);
  };

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount. taken from https://react-dropzone.js.org/#section-basic-example
    return () =>
      selectedFiles.forEach(file => URL.revokeObjectURL(file.previewUrl));
  }, [selectedFiles]);

  return (
    <>
      {selectedFiles.length > 0 && (
        <SelectedFilesPreview
          onClearAll={clearAll}
          selectedFiles={selectedFiles}
          disabled={disabled}
        />
      )}
      {selectedFiles.length < 1 && (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <DropzoneContent
            showAcceptBorder={isDragActive && isDragAccept}
            showRejectBorder={isDragActive && isDragReject}
          />
        </div>
      )}
    </>
  );
};

const DropzoneContent = ({
  showAcceptBorder,
  showRejectBorder,
}: {
  showAcceptBorder: boolean;
  showRejectBorder: boolean;
}) => {
  return (
    <div>
      <div
        className={twMerge(
          'cursor-pointer p-12 flex justify-center bg-white/70 border border-dashed border-gray-300 rounded-xl hover:bg-white/90 hover:border-gray-400',
          showAcceptBorder && 'border-green-500',
          showRejectBorder && 'border-red-500',
        )}>
        <div className="text-center">
          <span className="inline-flex justify-center items-center size-16 bg-gray-200 text-gray-800 rounded-full">
            <CloudUpload />
          </span>

          <div className="mt-4 flex flex-wrap justify-center text-sm leading-6">
            <span className="pe-1 font-medium text-gray-800">
              Drop your file here or
            </span>
            <span className="font-semibold text-accent hover:text-accent/70 rounded-lg decoration-2 hover:underline focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
              browse
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Pick a file up to {prettyBytes(MAX_FILE_SIZE_BYTES)}.
          </p>
        </div>
      </div>
    </div>
  );
};

const SelectedFilesPreview = ({
  selectedFiles,
  onClearAll,
  disabled,
}: {
  selectedFiles: SelectedFile[];
  onClearAll: () => void;
  disabled: boolean;
}) => {
  return selectedFiles.map(selectedFile => (
    <div key={selectedFile.file.path}>
      <div className="p-3 bg-white border border-solid border-gray-300 rounded-xl">
        <div className="mb-1 flex flex-row justify-between items-center">
          <span className="size-20 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
            <img
              className="h-full w-full object-cover rounded-lg"
              src={selectedFile.previewUrl}
              // Revoke data uri after image is loaded, taken from https://react-dropzone.js.org/#section-basic-example
              onLoad={() => {
                URL.revokeObjectURL(selectedFile.previewUrl);
              }}
            />
          </span>
          <div className="max-w-[80%] pl-4 pr-2 mr-auto">
            <p className="text-sm font-medium text-gray-800 text-ellipsis text-nowrap overflow-hidden">
              <span>{selectedFile.file.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              {prettyBytes(selectedFile.file.size)}
            </p>
          </div>
          {!disabled && (
            <button
              className="text-gray-500 hover:text-gray-800 mr-2"
              onClick={onClearAll}
              disabled={disabled}>
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  ));
};

const getErrorMessage = (errorCode: ErrorCode | string) => {
  switch (errorCode) {
    case ErrorCode.FileInvalidType:
      return 'Invalid file type. Please upload a JPEG or PNG';
    case ErrorCode.FileTooSmall:
      return 'File too small. Please upload a larger file';
    case ErrorCode.FileTooLarge:
      return 'File too large. Please upload a smaller file';
    case ErrorCode.TooManyFiles:
      return 'Can only upload one file';
    default:
      return 'Invalid file';
  }
};
