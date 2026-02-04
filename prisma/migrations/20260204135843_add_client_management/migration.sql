-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "lifecycleStatus" TEXT NOT NULL DEFAULT 'LEAD',
    "weightage" TEXT NOT NULL DEFAULT 'REGULAR',
    "relationshipLevel" TEXT NOT NULL DEFAULT 'WEAK',
    "leadScore" INTEGER,
    "expectedValue" REAL,
    "isHighRisk" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'Other',
    "notes" TEXT,
    "ownerId" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClientHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClientHistory_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClientHistory_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Client_ownerId_idx" ON "Client"("ownerId");

-- CreateIndex
CREATE INDEX "Client_lifecycleStatus_idx" ON "Client"("lifecycleStatus");

-- CreateIndex
CREATE INDEX "Client_isArchived_idx" ON "Client"("isArchived");

-- CreateIndex
CREATE INDEX "ClientHistory_clientId_idx" ON "ClientHistory"("clientId");

-- CreateIndex
CREATE INDEX "ClientHistory_actorId_idx" ON "ClientHistory"("actorId");

-- CreateIndex
CREATE INDEX "ClientHistory_createdAt_idx" ON "ClientHistory"("createdAt");
