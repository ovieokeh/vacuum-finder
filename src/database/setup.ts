import Database from "better-sqlite3";

const db = new Database("./src/database/database.db");

export const setupDatabase = () => {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS vacuums (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          image TEXT NOT NULL,
          brand TEXT NOT NULL,
          model TEXT NOT NULL,
          price REAL NOT NULL,
          batteryLifeMins INTEGER NOT NULL,
          suctionPowerPa INTEGER NOT NULL,
          noiseLevelDb INTEGER NOT NULL,
          mappingTechnology TEXT CHECK(mappingTechnology IN ('Laser', 'Camera')) NOT NULL,
          multiFloorMapping BOOLEAN,
          virtualWalls BOOLEAN,
          mopFunction BOOLEAN,
          selfEmptying BOOLEAN,
          appControl BOOLEAN,
          petHair BOOLEAN
      );
  `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS affiliate_links (
          id TEXT PRIMARY KEY,
          vacuumId TEXT NOT NULL,
          region TEXT CHECK(region IN ('America', 'Europe', 'Asia', 'Africa')) NOT NULL,
          site TEXT NOT NULL,
          link TEXT NOT NULL,
          FOREIGN KEY (vacuumId) REFERENCES vacuums(id) ON DELETE CASCADE
      );
  `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS vacuum_filter_options (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          houseSizeSqM INTEGER NOT NULL,
          floorType TEXT CHECK(floorType IN ('Carpet', 'Hardwood', 'Tile', 'Laminate')) NOT NULL,
          budget REAL NOT NULL,
          numRooms INTEGER NOT NULL,
          numPets INTEGER NOT NULL,
          mopFunction BOOLEAN NOT NULL
      );
  `);
    console.log("Database setup complete.");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

// setupDatabase();
