CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  descriptors TEXT
);

CREATE TABLE "items" (
  "id" INTEGER,
  "primaryTitle" TEXT NOT NULL,
  "secondaryTitle" TEXT,
  "description" TEXT,
  "thumbnailUrl" TEXT,
  "takenByUserId" INTEGER,
  "accessoryTaken" INTEGER,
  "timeTaken" INTEGER,
  PRIMARY KEY("id")
);

CREATE TABLE log (
  userId INTEGER,
  itemId INTEGER,
  action INTEGER NOT NULL,
  info TEXT,
  timestamp INTEGER NOT NULL
);