const { PrismaClient } = require("@prisma/client") as {
  PrismaClient: typeof import("@prisma/client").PrismaClient;
};

const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as {
  PrismaBetterSqlite3: typeof import("@prisma/adapter-better-sqlite3").PrismaBetterSqlite3;
};

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    }),
    log: ["error"],
  });

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
