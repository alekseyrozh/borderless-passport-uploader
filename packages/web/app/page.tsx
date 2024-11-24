'use client';

import { FileUpload } from '@/components/file-upload';
import { ChangeEvent, useState } from 'react';

export default function Home() {
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;

    const localFileUrl = URL.createObjectURL(file);
    setLocalFileUrl(localFileUrl);

    const reader = new FileReader();
    reader.onload = async event => {
      const fileData = event.target?.result;
      if (fileData) {
        console.log(fileData);
        const presignedURL =
          'https://k2gh7joob9.execute-api.eu-west-1.amazonaws.com/generate-passport-upload-url';

        fetch(presignedURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer user123',
          },
        })
          .then(res => res.json())
          .then(res => {
            const body = new Blob([fileData], { type: file.type });
            fetch(res.uploadUrl, {
              body,
              method: 'PUT',
            }).then(() => {
              console.log('File uploaded');
            });
          });
      }
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="flex flex-col items-center my-20">
      <h1 className="text-7xl font-normal text-dark-brand font-[family-name:var(--font-playfair-display)] text-center text-balance">
        Borderless passport uploader
      </h1>
      <p className="text-xl text-dark-brand mt-8">
        Extract key dates from your documents with ease
      </p>
      <div className="w-[600px] max-w-full px-5 mt-12">
        <FileUpload />
      </div>
      {localFileUrl && (
        <div style={{ marginTop: '20px' }}>
          <p className="">Image Preview:</p>
          <img
            src={localFileUrl}
            alt="Selected Preview"
            style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
}
