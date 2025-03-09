/*
  Warnings:

  - You are about to drop the `APIKey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "APIKey";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "keyType" TEXT NOT NULL DEFAULT 'Bronze',
    "ownerId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "totalRequests" INTEGER NOT NULL DEFAULT 1000,
    "usedRequests" INTEGER NOT NULL DEFAULT 0,
    "remainingRequests" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_apiKey_key" ON "ApiKey"("apiKey");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
