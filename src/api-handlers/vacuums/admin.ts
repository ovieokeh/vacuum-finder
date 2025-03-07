import { Request, Response } from "express";

import { db, supabase } from "../../database";
import { AffiliateLinkBase } from "../../types";
import { randomUUID } from "crypto";

// Add a new vacuum
export const addVacuumHandler = async (req: Request, res: Response) => {
  const { data: user } = await supabase.auth.getUser(req.headers.authorization as string);

  if (!user?.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const {
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
    affiliateLinks,
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO vacuums (
      id,
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
        addedBy
      ) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const result = stmt.run(
      randomUUID(),
      imageUrl,
      brand,
      model,
      mappingTechnology,
      batteryLifeInMinutes,
      suctionPowerInPascals,
      noiseLevelInDecibels,
      dustbinCapacityInLiters,
      hasMoppingFeature ? 1 : 0,
      hasSelfEmptyingFeature ? 1 : 0,
      hasZoneCleaningFeature ? 1 : 0,
      hasMultiFloorMappingFeature ? 1 : 0,
      hasCarpetBoostFeature ? 1 : 0,
      hasVirtualWallsFeature ? 1 : 0,
      hasSmartHomeIntegration ? 1 : 0,
      hasVoiceControl ? 1 : 0,
      hasAppControl ? 1 : 0,
      hasRemoteControl ? 1 : 0,
      hasManualControl ? 1 : 0,
      otherFeatures ? JSON.stringify(otherFeatures) : null,
      user.user.email
    );

    if (affiliateLinks.length > 0) {
      const affiliateStmt = db.prepare(`
        INSERT INTO affiliate_links (
          id,
          vacuumId,
          region,
          currency,
          price,
          site,
          url,
          addedBy
        ) VALUES (?,?,?,?,?,?,?)
      `);

      affiliateLinks.forEach((affiliateLink: AffiliateLinkBase) => {
        affiliateStmt.run(
          randomUUID(),
          result.lastInsertRowid,
          affiliateLink.region,
          affiliateLink.currency,
          affiliateLink.price,
          affiliateLink.site,
          affiliateLink.url,
          user.user.email
        );
      });
    }

    res.json({ message: "Vacuum added successfully.", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a vacuum by id
export const deleteVacuumHandler = async (req: Request, res: Response) => {
  const user = await supabase.auth.getUser(req.headers.authorization as string);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

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
export const updateVacuumHandler = async (req: Request, res: Response) => {
  const user = await supabase.auth.getUser(req.headers.authorization as string);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

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
