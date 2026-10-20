-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "bggId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "yearPublished" INTEGER,
    "image" TEXT,
    "thumbnail" TEXT,
    "minPlayers" INTEGER,
    "maxPlayers" INTEGER,
    "playingTime" INTEGER,
    "averageRating" DOUBLE PRECISION,
    "bggSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_bggId_key" ON "Game"("bggId");
