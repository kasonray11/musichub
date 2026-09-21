-- CreateTable
CREATE TABLE "PlayEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "track" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "PlayEvent_track_artist_idx" ON "PlayEvent"("track", "artist");
