import { Request, Response } from "express";

import { db } from "../../database";
import { AffiliateLink } from "../../types";

// Add a new vacuum
export const addVacuumHandler = (req: Request, res: Response) => {
  const {
    details: {
      imageUrl,
      brand,
      model,
      mappingTechnology,
      batteryLifeInMinutes,
      suctionPowerInPascals,
      noiseLevelInDecibels,
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
    },
    affiliateLinks,
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO vacuums (
        imageUrl,
        brand,
        model,
        mappingTechnology,
        batteryLifeInMinutes,
        suctionPowerInPascals,
        noiseLevelInDecibels,
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
        otherFeatures
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const result = stmt.run(
      imageUrl,
      brand,
      model,
      mappingTechnology,
      batteryLifeInMinutes,
      suctionPowerInPascals,
      noiseLevelInDecibels,
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
      otherFeatures
    );

    if (affiliateLinks.length > 0) {
      const affiliateStmt = db.prepare(`
        INSERT INTO affiliate_links (
          vacuumId,
          region,
          currency,
          price,
          site,
          url
        ) VALUES (?,?,?,?,?,?)
      `);

      affiliateLinks.forEach((affiliateLink: AffiliateLink) => {
        affiliateStmt.run(
          result.lastInsertRowid,
          affiliateLink.region,
          affiliateLink.currency,
          affiliateLink.price,
          affiliateLink.site,
          affiliateLink.url
        );
      });
    }

    res.json({ message: "Vacuum added successfully.", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a vacuum by id
export const deleteVacuumHandler = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare(`DELETE FROM vacuums WHERE id = ?`);
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Vacuum not found." });
    }

    res.json({ message: "Vacuum deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a vacuum by id
export const updateVacuumHandler = (req: Request, res: Response) => {
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Missing data." });
  }

  if (!data.id) {
    return res.status(400).json({ error: "Missing id." });
  }

  const keys = Object.keys(data);
  const values = Object.values(data);

  try {
    const stmt = db.prepare(`
      UPDATE vacuums
      SET ${keys.map((key) => `${key} = ?`).join(", ")}
      WHERE id = ?
    `);

    const result = stmt.run(...values, data.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Vacuum not found." });
    }

    res.json({ message: "Vacuum updated successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
