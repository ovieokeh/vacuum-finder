import { db } from ".";
import { mockVacuums } from "./mock";

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

export const populateMockData = () => {
  try {
    const insertVacuum = db.prepare(`
      INSERT INTO vacuums (
        id, name, image, brand, model, price, batteryLifeMins, suctionPowerPa, noiseLevelDb, 
        mappingTechnology, multiFloorMapping, virtualWalls, mopFunction, selfEmptying, appControl, petHair
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    return db.transaction(() => {
      for (const vacuum of mockVacuums) {
        try {
          insertVacuum.run(
            vacuum.id,
            vacuum.name,
            vacuum.image,
            vacuum.brand,
            vacuum.model,
            vacuum.price,
            vacuum.batteryLifeMins,
            vacuum.suctionPowerPa,
            vacuum.noiseLevelDb,
            vacuum.mappingTechnology,
            vacuum.multiFloorMapping ? 1 : 0,
            vacuum.virtualWalls ? 1 : 0,
            vacuum.mopFunction ? 1 : 0,
            vacuum.selfEmptying ? 1 : 0,
            vacuum.appControl ? 1 : 0,
            vacuum.petHair ? 1 : 0
          );
        } catch (error) {
          console.info("Error populating mock data:", error);
        }
      }
      console.log("Mock data populated.");
    })();
  } catch (error) {
    console.error("Error populating mock data:", error);
  }
};
