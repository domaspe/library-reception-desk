CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  
  name TEXT NOT NULL,
  descriptors TEXT
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  primaryTitle TEXT NOT NULL,
  secondaryTitle TEXT,
  description TEXT,
  thumbnailUrl TEXT,
  takenByUserId INTEGER,
  accessoryTaken INTEGER,
  timeTaken INTEGER
);

CREATE TABLE log (
	userId	INTEGER,
	itemId	INTEGER,
  action	INTEGER NOT NULL,
  info	TEXT,
	timestamp	INTEGER NOT NULL
);