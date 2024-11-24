import { CloudUpload, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

type FileWithPreview = {
  previewUrl: string;
  file: FileWithPath;
};

// heavily inspired by https://preline.co/docs/file-upload.html
export const FileUpload = () => {
  const [filesWithPreview, setFilesWithPreview] = useState<FileWithPreview[]>(
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 2, // TODO: 2mb, or what the unit here?
    onDrop: acceptedFiles => {
      setFilesWithPreview(
        acceptedFiles.map(file => ({
          previewUrl: URL.createObjectURL(file),
          file,
        })),
      );
    },
  });

  const clearAll = () => {
    setFilesWithPreview([]);
  };

  return (
    <>
      {filesWithPreview.map(fileWithPreview => (
        <div key={fileWithPreview.file.path}>
          <div className="p-3 bg-white border border-solid border-gray-300 rounded-xl">
            <div className="mb-1 flex justify-between items-center">
              <div className="flex items-center gap-x-3">
                <span className="size-20 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
                  <img
                    className="h-full w-full object-cover rounded-lg"
                    // className="rounded-lg hidden"
                    src={fileWithPreview.previewUrl}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                      URL.revokeObjectURL(fileWithPreview.previewUrl);
                    }}
                  />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {/* <span className="truncate inline-block max-w-[300px] align-bottom"></span> */}
                    <span>{fileWithPreview.file.name}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {fileWithPreview.file.size} bytes
                  </p>
                  {/* <p className="text-xs text-red-500" style={{ display: 'none' }}>
                  File exceeds size limit.
                </p> */}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <span
                  className="hs-tooltip [--placement:top] inline-block"
                  style={{ display: 'none' }}>
                  <span className="hs-tooltip-toggle text-red-500 hover:text-red-800 focus:outline-none focus:text-red-800">
                    <span
                      className="hs-tooltip-content max-w-[100px] hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                      role="tooltip">
                      Please try to upload a file smaller than 2MB.
                    </span>
                  </span>
                </span>

                <button
                  className="text-gray-500 hover:text-gray-800 mr-2"
                  onClick={clearAll}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* 
          <div className="flex items-center gap-x-3 whitespace-nowrap">
            <div
              className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden"
              role="progressbar"
              data-hs-file-upload-progress-bar="">
              <div
                className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition-all duration-500 hs-file-upload-complete:bg-green-500"
                style={{ width: '0' }}
                data-hs-file-upload-progress-bar-pane=""></div>
            </div>
            <div className="w-10 text-end">
              <span className="text-sm text-gray-800">
                <span data-hs-file-upload-progress-bar-value="">0</span>%
              </span>
            </div>
          </div> */}
          </div>
          <button className="bg-dark-brand text-background hover:opacity-70 w-full py-3 rounded-xl mt-2 font-[family-name:var(--font-geist-mono)] uppercase text-sm">
            Extract dates
          </button>
        </div>
      ))}
      {filesWithPreview.length < 1 && (
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div>
            <div className="cursor-pointer p-12 flex justify-center bg-white/70 border border-dashed border-gray-300 rounded-xl hover:bg-white/90 hover:border-gray-400">
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
                  Pick a file up to 2MB.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
