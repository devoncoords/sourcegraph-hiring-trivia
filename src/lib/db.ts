import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if database URL is available
export const prisma = process.env.DATABASE_URL 
  ? globalForPrisma.prisma ?? new PrismaClient()
  : null as any; // Fallback for deployment without database

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}
