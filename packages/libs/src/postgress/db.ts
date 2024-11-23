import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.sql';
import { Resource } from 'sst';

const createDbClient = () => {
  const sql = neon(
    Resource.NeonDbBorderlessPassportUploaderConnectionString.value,
  );
  const db = drizzle(sql, { schema: { ...schema } });
  return db;
};

export type Db = ReturnType<typeof createDbClient>;
let db: Db;

export const getDb = () => {
  if (!db) {
    console.log('Creating db client');
    db = createDbClient();
  } else {
    console.log('Using existing db client');
  }

  return db;
};
