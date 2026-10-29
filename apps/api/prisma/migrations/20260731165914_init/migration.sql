-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "department" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "money" INTEGER NOT NULL DEFAULT 0,
    "reputation" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnedUpgrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "upgradeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnedUpgrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnlockedAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnlockedAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhaseResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "wrongCount" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "moneyEarned" INTEGER NOT NULL,
    "timeUsedSeconds" INTEGER NOT NULL,
    "bestCombo" INTEGER NOT NULL,
    "conceptCorrectCounts" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhaseResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OwnedUpgrade_userId_upgradeId_key" ON "OwnedUpgrade"("userId", "upgradeId");

-- CreateIndex
CREATE UNIQUE INDEX "UnlockedAchievement_userId_achievementId_key" ON "UnlockedAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "PhaseResult_userId_idx" ON "PhaseResult"("userId");

-- CreateIndex
CREATE INDEX "PhaseResult_dayId_idx" ON "PhaseResult"("dayId");

-- AddForeignKey
ALTER TABLE "OwnedUpgrade" ADD CONSTRAINT "OwnedUpgrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockedAchievement" ADD CONSTRAINT "UnlockedAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhaseResult" ADD CONSTRAINT "PhaseResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
