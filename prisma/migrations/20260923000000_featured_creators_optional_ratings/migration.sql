-- AlterTable
ALTER TABLE "Creators" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DiaryEntries" ALTER COLUMN "rating" DROP NOT NULL;
