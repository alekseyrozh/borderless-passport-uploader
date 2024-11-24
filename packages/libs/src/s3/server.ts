import { v4 as generateUuid } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst/resource';
import { mimeToExtension } from '../utils/server';

export const generateImageUploadUrl = async ({
  userId,
  fileMimeType,
}: {
  userId: string;
  fileMimeType: string;
}) => {
  const imageId = generateUuid();

  const command = new PutObjectCommand({
    Key: constructS3FileName({
      userId,
      imageId,
      fileExtension: mimeToExtension(fileMimeType),
    }),
    Bucket: Resource.Documents.name,
  });
  const uploadUrl = await getSignedUrl(new S3Client(), command, {
    expiresIn: 3600, // 1 hour in seconds
  });
  return { uploadUrl, imageId };
};

export const constructS3FileName = ({
  userId,
  imageId,
  fileExtension,
}: {
  userId: string;
  imageId: string;
  fileExtension: string;
}) => {
  return `${userId}/${imageId}.${fileExtension}`;
};

export const parseS3FileName = (fileName: string) => {
  // get rid of file extension and split by '/'
  const [userId, imageId] = fileName.split('.')[0].split('/');
  return { userId, imageId };
};
