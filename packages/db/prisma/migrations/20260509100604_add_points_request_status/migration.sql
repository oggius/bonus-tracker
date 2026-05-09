-- CreateEnum
CREATE TYPE "PointsLogStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PointsLogInitiatedBy" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "PointsLog" ADD COLUMN     "initiatedBy" "PointsLogInitiatedBy" NOT NULL DEFAULT 'ADMIN',
ADD COLUMN     "status" "PointsLogStatus" NOT NULL DEFAULT 'APPROVED';
