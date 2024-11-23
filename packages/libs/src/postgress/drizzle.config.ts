import { defineConfig } from 'drizzle-kit';
import { Resource } from 'sst';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: Resource.NeonDbBorderlessPassportUploaderConnectionString.value,
  },
  schema: ['./src/postgress/**/*.sql.ts'],
  out: './src/postgress/migrations',
  verbose: true,
  strict: true,
});
