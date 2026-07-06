import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

let isDatabaseReady = false;

export async function ensureDatabase() {
  if (isDatabaseReady) {
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Property" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "price" REAL NOT NULL,
      "area" REAL NOT NULL,
      "builtYear" INTEGER NOT NULL,
      "monthlyRent" REAL NOT NULL,
      "maintenanceFee" REAL NOT NULL,
      "neighborhood" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Analysis" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "propertyId" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "summary" TEXT NOT NULL,
      "marketAnalysis" TEXT NOT NULL,
      "investmentReport" TEXT NOT NULL,
      "riskAnalysis" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Analysis_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Analysis_propertyId_key" ON "Analysis"("propertyId");
  `);

  isDatabaseReady = true;
}
