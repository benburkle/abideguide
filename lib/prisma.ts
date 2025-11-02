import { PrismaClient } from './prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure DATABASE_URL is resolved correctly for SQLite
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl?.startsWith('file:')) {
  // Resolve relative paths to absolute paths
  const dbPath = databaseUrl.replace('file:', '');
  if (!path.isAbsolute(dbPath)) {
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), dbPath)}`;
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

