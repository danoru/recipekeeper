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
    "image" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,

    CONSTRAINT "Creators_pkey" PRIMARY KEY ("link")
);

-- CreateTable
CREATE TABLE "DiaryEntries" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recipeId" INTEGER,
    "rating" DECIMAL(2,1),
    "comment" TEXT,
    "date" DATE,
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
    "recipeid" INTEGER NOT NULL,

    CONSTRAINT "FavoritesRecipes_pkey" PRIMARY KEY ("userId","recipeid")
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
    "rating" DECIMAL(2,1),
    "comment" TEXT,
    "date" DATE,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "location" TEXT,
    "website" TEXT,
    "bio" TEXT,
    "image" TEXT,
    "badge" "Badge" NOT NULL DEFAULT 'USER',
    "joinDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creators_link_key" ON "Creators"("link");

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
ALTER TABLE "FavoritesRecipes" ADD CONSTRAINT "FavoritesRecipes_recipeid_fkey" FOREIGN KEY ("recipeid") REFERENCES "Recipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
