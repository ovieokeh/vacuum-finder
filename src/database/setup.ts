import { randomUUID } from "crypto";
import { db } from ".";
import { mockAffiliateLinks, mockVacuums } from "./mock";

export const setupDatabase = () => {
  try {
    if (process.env.RESET_DATABASE === "true") {
      db.exec("DROP TABLE IF EXISTS vacuums;");
      db.exec("DROP TABLE IF EXISTS affiliate_links;");
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS vacuums (
          id TEXT PRIMARY KEY,
          imageUrl TEXT NOT NULL,
          brand TEXT NOT NULL,
          model TEXT NOT NULL,
          mappingTechnology TEXT NOT NULL,
          batteryLifeInMinutes INTEGER NOT NULL,
          suctionPowerInPascals INTEGER NOT NULL,
          noiseLevelInDecibels INTEGER NOT NULL,
          waterTankCapacityInLiters INTEGER NOT NULL,
          dustbinCapacityInLiters INTEGER NOT NULL,
          hasMoppingFeature BOOLEAN DEFAULT 0,
          hasSelfEmptyingFeature BOOLEAN DEFAULT 0,
          hasZoneCleaningFeature BOOLEAN DEFAULT 0,
          hasMultiFloorMappingFeature BOOLEAN DEFAULT 0,
          hasCarpetBoostFeature BOOLEAN DEFAULT 0,
          hasVirtualWallsFeature BOOLEAN DEFAULT 0,
          hasSmartHomeIntegration BOOLEAN DEFAULT 0,
          hasVoiceControl BOOLEAN DEFAULT 0,
          hasAppControl BOOLEAN DEFAULT 0,
          hasRemoteControl BOOLEAN DEFAULT 0,
          hasManualControl BOOLEAN DEFAULT 0,
          otherFeatures TEXT DEFAULT NULL,
          addedBy TEXT DEFAULT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS affiliate_links (
          id TEXT PRIMARY KEY,
          vacuumId TEXT NOT NULL,
          region TEXT NOT NULL,
          currency TEXT NOT NULL,
          price REAL NOT NULL,
          site TEXT NOT NULL,
          url TEXT NOT NULL,
          addedBy TEXT DEFAULT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (vacuumId) REFERENCES vacuums(id) ON DELETE CASCADE
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
      INSERT OR IGNORE INTO vacuums (
          id,
          imageUrl,
          brand,
          model,
          mappingTechnology,
          batteryLifeInMinutes,
          suctionPowerInPascals,
          noiseLevelInDecibels,
          waterTankCapacityInLiters,
          dustbinCapacityInLiters,
          hasMoppingFeature,
          hasSelfEmptyingFeature,
          hasZoneCleaningFeature,
          hasMultiFloorMappingFeature,
          hasCarpetBoostFeature,
          hasVirtualWallsFeature,
          hasSmartHomeIntegration,
          hasVoiceControl,
          hasAppControl,
          hasRemoteControl,
          hasManualControl,
          otherFeatures,
          addedBy
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `);

    db.transaction(() => {
      for (const vacuum of mockVacuums) {
        try {
          insertVacuum.run(
            vacuum.id,
            vacuum.imageUrl,
            vacuum.brand,
            vacuum.model,
            vacuum.mappingTechnology,
            vacuum.batteryLifeInMinutes,
            vacuum.suctionPowerInPascals,
            vacuum.noiseLevelInDecibels,
            vacuum.waterTankCapacityInLiters,
            vacuum.dustbinCapacityInLiters,
            vacuum.hasMoppingFeature ? 1 : 0,
            vacuum.hasSelfEmptyingFeature ? 1 : 0,
            vacuum.hasZoneCleaningFeature ? 1 : 0,
            vacuum.hasMultiFloorMappingFeature ? 1 : 0,
            vacuum.hasCarpetBoostFeature ? 1 : 0,
            vacuum.hasVirtualWallsFeature ? 1 : 0,
            vacuum.hasSmartHomeIntegration ? 1 : 0,
            vacuum.hasVoiceControl ? 1 : 0,
            vacuum.hasAppControl ? 1 : 0,
            vacuum.hasRemoteControl ? 1 : 0,
            vacuum.hasManualControl ? 1 : 0,
            JSON.stringify(vacuum.otherFeatures),
            "System"
          );
        } catch (error) {
          console.info("Error populating mock vacuum data:", (error as any).message);
        }
      }
      console.log("Mock vacuum data populated.");
    })();

    const insertAffiliateLink = db.prepare(`
      INSERT OR IGNORE INTO affiliate_links (
          id,
          vacuumId,
          region,
          currency,
          price,
          site,
          url,
          addedBy
      ) VALUES (?,?,?,?,?,?,?,?)
    `);

    db.transaction(() => {
      for (const affiliateLink of mockAffiliateLinks) {
        try {
          insertAffiliateLink.run(
            randomUUID(),
            affiliateLink.vacuumId,
            affiliateLink.region,
            affiliateLink.currency,
            affiliateLink.price,
            affiliateLink.site,
            affiliateLink.url,
            "System"
          );
        } catch (error) {
          console.info("Error populating mock affiliate data:", (error as any).message);
        }
      }
      console.log("Mock affiliate data populated.");
    })();
  } catch (error) {
    console.error("Error populating mock data:", error);
  }
};
