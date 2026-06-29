import { PrismaClient } from "@prisma/client";
import { isDatabaseConfigured } from "./utils";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function resolveDatabaseUrl(env: Record<string, string | undefined> = process.env) {
  const candidates = [
    env.DATABASE_URL,
    env.POSTGRES_URL,
    env.POSTGRES_PRISMA_URL,
    env.POSTGRES_URL_NON_POOLING,
    env.DIRECT_URL,
  ];

  return candidates.find(Boolean) ?? null;
}

function createPrismaClient(): PrismaClient | null {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl || !isDatabaseConfigured()) {
    return null;
  }

  process.env.DATABASE_URL = databaseUrl;
  if (!process.env.DIRECT_URL && process.env.DIRECT_URL !== undefined) {
    process.env.DIRECT_URL = databaseUrl;
  }

  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

export function getPrisma(): PrismaClient | null {
  return prisma;
}
