import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Cliente Prisma con adapter Postgres (Prisma 7). Se instancia solo si hay
// DATABASE_URL configurada; en caso contrario `prisma` es null y los route
// handlers degradan con elegancia (no persisten, pero no fallan en dev).
const url = process.env.DATABASE_URL;

function createClient(): PrismaClient | null {
  if (!url) return null;
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient | null };

export const prisma: PrismaClient | null = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
