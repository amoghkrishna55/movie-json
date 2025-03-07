-- CreateEnum
CREATE TYPE "DATA_TYPE" AS ENUM ('MOVIE', 'TV_SHOW');

-- CreateTable
CREATE TABLE "DATA" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "DATA_TYPE" NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DATA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "season" INTEGER NOT NULL,
    "dataId" TEXT NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sources" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "quality" TEXT NOT NULL,

    CONSTRAINT "Sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtitles" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "language" TEXT NOT NULL,

    CONSTRAINT "Subtitles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_dataId_fkey" FOREIGN KEY ("dataId") REFERENCES "DATA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sources" ADD CONSTRAINT "Sources_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtitles" ADD CONSTRAINT "Subtitles_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
