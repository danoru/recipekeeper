-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('ADMIN', 'PATRON', 'USER');

-- CreateTable
CREATE TABLE "Cooklist" (
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "Cooklist_pkey" PRIMARY KEY ("userId","recipeId")
);

-- CreateTable
CREATE TABLE "Creators" (
    "link" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "youtube" TEXT NOT NULL,

    CONSTRAINT "Creators_pkey" PRIMARY KEY ("link")
);

-- CreateTable
CREATE TABLE "DiaryEntries" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "comment" TEXT,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "hasCookedBefore" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiaryEntries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesCreators" (
    "userId" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "FavoritesCreators_pkey" PRIMARY KEY ("userId","creatorId")
);

-- CreateTable
CREATE TABLE "FavoritesRecipes" (
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "FavoritesRecipes_pkey" PRIMARY KEY ("userId","recipeId")
);

-- CreateTable
CREATE TABLE "Following" (
    "userId" INTEGER NOT NULL,
    "followingUsername" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("userId","followingUsername")
);

-- CreateTable
CREATE TABLE "LikedCreators" (
    "userId" INTEGER NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "LikedCreators_pkey" PRIMARY KEY ("userId","creatorId")
);

-- CreateTable
CREATE TABLE "LikedRecipes" (
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER NOT NULL,

    CONSTRAINT "LikedRecipes_pkey" PRIMARY KEY ("userId","recipeId")
);

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "cuisine" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "diet" TEXT NOT NULL,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "comment" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" CITEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "location" TEXT,
    "website" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "badge" "Badge" NOT NULL DEFAULT 'USER',
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creators_link_key" ON "Creators"("link");

-- CreateIndex
CREATE INDEX "DiaryEntries_userId_date_idx" ON "DiaryEntries"("userId", "date" DESC);

-- CreateIndex
CREATE INDEX "DiaryEntries_recipeId_idx" ON "DiaryEntries"("recipeId");

-- CreateIndex
CREATE INDEX "Following_followingUsername_idx" ON "Following"("followingUsername");

-- CreateIndex
CREATE INDEX "LikedCreators_creatorId_idx" ON "LikedCreators"("creatorId");

-- CreateIndex
CREATE INDEX "LikedRecipes_recipeId_idx" ON "LikedRecipes"("recipeId");

-- CreateIndex
CREATE INDEX "Recipes_creatorId_idx" ON "Recipes"("creatorId");

-- CreateIndex
CREATE INDEX "Reviews_recipeId_idx" ON "Reviews"("recipeId");

-- CreateIndex
CREATE INDEX "Reviews_userId_idx" ON "Reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Cooklist" ADD CONSTRAINT "Cooklist_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cooklist" ADD CONSTRAINT "Cooklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DiaryEntries" ADD CONSTRAINT "DiaryEntries_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DiaryEntries" ADD CONSTRAINT "DiaryEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FavoritesCreators" ADD CONSTRAINT "FavoritesCreators_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creators"("link") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FavoritesCreators" ADD CONSTRAINT "FavoritesCreators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FavoritesRecipes" ADD CONSTRAINT "FavoritesRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FavoritesRecipes" ADD CONSTRAINT "FavoritesRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LikedCreators" ADD CONSTRAINT "LikedCreators_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creators"("link") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LikedCreators" ADD CONSTRAINT "LikedCreators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LikedRecipes" ADD CONSTRAINT "LikedRecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LikedRecipes" ADD CONSTRAINT "LikedRecipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Recipes" ADD CONSTRAINT "Recipes_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creators"("link") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
