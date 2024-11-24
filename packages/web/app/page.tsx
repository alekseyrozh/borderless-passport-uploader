'use client';

import { FileSelector } from '@/components/file-upload';
import { API_BASE_URL } from '@/utils/constants';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ScreenState } from '@/types/screen-state';
import { Loader2 } from 'lucide-react';
import { GeneratePassportUploadUrlApiBody } from '@borderless-passport-uploader/libs/passport-parsing/client';

export default function Home() {
  const [screenState, setScreenState] = useState<ScreenState>(
    ScreenState.SELECTING_IMAGE,
  );
  const [imageId, setImageId] = useState<string | null>(null);

  const uploadFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async event => {
      const fileData = event.target?.result;
      if (fileData) {
        console.log(fileData);
        const presignedURL = `${API_BASE_URL}/generate-passport-upload-url`;

        debugger;
        fetch(presignedURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer user123',
          },
          body: JSON.stringify({
            fileMimeType: file.type as any, // we validate MIME file types in dropzone config
          } satisfies GeneratePassportUploadUrlApiBody),
        })
          .then(res => res.json())
          .then(res => {
            setImageId(res.imageId);
            const body = new Blob([fileData], { type: file.type });
            fetch(res.uploadUrl, {
              body,
              method: 'PUT',
            })
              .then(() => {
                setScreenState(ScreenState.IMAGE_PROCESSING);
              })
              .catch(() => {
                toast.error('Failed to upload file');
                setScreenState(ScreenState.ERROR);
              });
          });
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
      setScreenState(ScreenState.ERROR);
    };
    reader.readAsArrayBuffer(file);
    setScreenState(ScreenState.IMAGE_UPLOADING);
  };

  const shouldPoll = screenState === ScreenState.IMAGE_PROCESSING;
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (shouldPoll && imageId) {
      const startPolling = () => {
        pollingRef.current = setInterval(() => {
          fetch(`${API_BASE_URL}/passport-info?imageId=${imageId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer user123',
            },
          }).then(res => {
            if (res.status === 200) {
              res.json().then(data => {
                if (data.processingStatus === 'PROCESSED') {
                  setScreenState(ScreenState.IMAGE_PROCESSED);
                } else if (data.processingStatus === 'ERROR') {
                  setScreenState(ScreenState.ERROR);
                }
              });
            }
          });
        }, 5000); // Poll every 5 seconds
      };
      startPolling();
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [shouldPoll, imageId]);

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
          disabled={screenState !== ScreenState.SELECTING_IMAGE}
          button={selectedFile => (
            <button
              className="bg-dark-brand text-background hover:opacity-70 w-full py-3 rounded-xl mt-2 font-[family-name:var(--font-geist-mono)] uppercase text-sm flex flex-row items-center justify-center disabled:opacity-50"
              onClick={() => {
                uploadFile(selectedFile);
              }}
              disabled={screenState !== ScreenState.SELECTING_IMAGE}>
              {screenState === ScreenState.SELECTING_IMAGE && 'Extract dates'}
              {screenState === ScreenState.IMAGE_UPLOADING && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              )}
              {screenState === ScreenState.IMAGE_PROCESSING && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                  Processing...
                </>
              )}
              {screenState === ScreenState.IMAGE_PROCESSED && <>Done</>}
              {screenState === ScreenState.ERROR && <>Error</>}
            </button>
          )}
        />
      </div>
    </div>
  );
}
