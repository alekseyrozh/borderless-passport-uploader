import { Db, images, eq, and } from '../postgress';
import { PassportProcessingStatus } from './types/domain';

export const savePassportImageToDb = async ({
  db,
  imageId,
  userId,
  processingStatus,
}: {
  db: Db;
  imageId: string;
  userId: string;
  processingStatus: PassportProcessingStatus;
}) => {
  await db.insert(images).values({
    imageId,
    userId,
    processingStatus,
    createdAt: new Date(),
  });
};

export const markPassportImageAsProcessedInDb = async ({
  db,
  imageId,
  userId,
  dateOfBirth,
  expirationDate,
  rawTextractData,
}: {
  db: Db;
  imageId: string;
  userId: string;
  dateOfBirth: Date;
  expirationDate: Date;
  rawTextractData: string;
}) => {
  await db
    .update(images)
    .set({
      processingStatus: PassportProcessingStatus.PROCESSED,
      dateOfBirth,
      expirationDate,
      rawTextractData,
    })
    .where(and(eq(images.imageId, imageId), eq(images.userId, userId)));
};

export const markPassportImageAsErroredInDb = async ({
  db,
  imageId,
  userId,
}: {
  db: Db;
  imageId: string;
  userId: string;
}) => {
  await db
    .update(images)
    .set({
      processingStatus: PassportProcessingStatus.ERROR,
      dateOfBirth: null,
      expirationDate: null,
      rawTextractData: null,
    })
    .where(and(eq(images.imageId, imageId), eq(images.userId, userId)));
};

export const getPassportImageDataFromDb = async ({
  db,
  imageId,
  userId,
}: {
  db: Db;
  imageId: string;
  userId: string;
}) => {
  return await db.query.images.findFirst({
    where: and(eq(images.imageId, imageId), eq(images.userId, userId)),
  });
};
