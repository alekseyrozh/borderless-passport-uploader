import { CloudUpload } from 'lucide-react';

// heavily inspired by https://preline.co/docs/file-upload.html
export const FileUpload = () => {
  return (
    <label
      className="text-sm bg-stone-200 hover:bg-stone-300"
      htmlFor="fileUpload">
      <input type="file" className="hidden" id="fileUpload" />
      <div>
        {/* <div className="p-3 bg-white border border-solid border-gray-300 rounded-xl">
          <div className="mb-1 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <span className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg">
                <img className="rounded-lg hidden" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  <span className="truncate inline-block max-w-[300px] align-bottom"></span>
                  .<span></span>
                </p>
                <p className="text-xs text-gray-500"></p>
                <p className="text-xs text-red-500" style={{ display: 'none' }}>
                  File exceeds size limit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <span
                className="hs-tooltip [--placement:top] inline-block"
                style={{ display: 'none' }}>
                <span className="hs-tooltip-toggle text-red-500 hover:text-red-800 focus:outline-none focus:text-red-800">
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                  <span
                    className="hs-tooltip-content max-w-[100px] hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                    role="tooltip">
                    Please try to upload a file smaller than 1MB.
                  </span>
                </span>
              </span>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                data-hs-file-upload-reload="">
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                </svg>
              </button>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800"
                data-hs-file-upload-remove="">
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" x2="10" y1="11" y2="17"></line>
                  <line x1="14" x2="14" y1="11" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>

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
          </div>
        </div> */}

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

            <p className="mt-1 text-xs text-gray-500">Pick a file up to 2MB.</p>
          </div>
        </div>
      </div>
    </label>
  );
};
