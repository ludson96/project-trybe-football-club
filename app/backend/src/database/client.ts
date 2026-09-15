import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const dbUser = process.env.DB_USER || 'root';
  const dbPass = process.env.DB_PASS || '123456';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '3002';
  const dbName = process.env.DB_NAME || 'TRYBE_FUTEBOL_CLUBE';

  if (process.env.DATABASE_PROVIDER === 'sqlite') {
    return 'file:./dev.db';
  }

  return `mysql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
};

const databaseUrl = getDatabaseUrl();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;
