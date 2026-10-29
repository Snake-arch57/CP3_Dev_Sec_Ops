-- Add username as the login identifier; email becomes optional
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Backfill existing rows with a username derived from their email local-part
UPDATE "User" SET "username" = split_part("email", '@', 1) WHERE "username" IS NULL;

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Email is no longer required or the login key
DROP INDEX IF EXISTS "User_email_key";
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
