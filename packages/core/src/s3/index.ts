import { v4 as generateUuid } from 'uuid';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Resource } from 'sst/resource';

export const generateImageUploadUrl = async ({
  userId,
}: {
  userId: string;
}) => {
  const imageId = generateUuid();

  const command = new PutObjectCommand({
    Key: constructS3FileName({ userId, imageId }),
    Bucket: Resource.MyBucket.name,
  });
  const uploadUrl = await getSignedUrl(new S3Client(), command, {
    expiresIn: 3600, // 1 hour in seconds
  });
  return { uploadUrl, imageId };
};

export const constructS3FileName = ({
  userId,
  imageId,
}: {
  userId: string;
  imageId: string;
}) => {
  return `${userId}/${imageId}.jpeg`;
};
