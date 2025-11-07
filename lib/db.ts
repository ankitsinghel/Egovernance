import { PrismaClient } from "@prisma/client";
import { LogLevel } from "@prisma/client/runtime/library";

declare global {
  // allow global prisma during dev to avoid multiple instances
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Allow enabling Prisma query logging locally by setting PRISMA_QUERY_LOG=true
const enablePrismaLog = process.env.PRISMA_QUERY_LOG === "true";
const prismaLog: LogLevel[] = enablePrismaLog
  ? ["query", "info", "warn", "error"]
  : [];

export const prisma =
  global.prisma ||
  new PrismaClient(prismaLog.length > 0 ? { log: prismaLog } : undefined);

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
