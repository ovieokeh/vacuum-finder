import { Request, Response } from "express";

import { db, supabase } from "../../database";
import { AffiliateLinkBase } from "../../types";
import { randomUUID } from "crypto";
import { TRACKING_LINK } from "../affiliate-links/admin";

const insertAffiliateLinks = (affiliateLinks: AffiliateLinkBase[], vacuumId: string, addedBy?: string) => {
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
    ) VALUES (?,?,?,?,?,?,?,?)
  `);

  affiliateLinks.forEach((affiliateLink: AffiliateLinkBase) => {
    const urlWithTrackingLink = `${affiliateLink.url}${TRACKING_LINK}`;

    affiliateStmt.run(
      randomUUID(),
      vacuumId,
      affiliateLink.region,
      affiliateLink.currency,
      affiliateLink.price,
      affiliateLink.site,
      urlWithTrackingLink,
      addedBy
    );
  });
};

// Add a new vacuum
export const addVacuumHandler = async (req: Request, res: Response) => {
  const { data: userData } = await supabase.auth.getUser(req.headers.authorization as string);

  if (!userData?.user) {
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
      ) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);

    const id = randomUUID();

    const result = stmt.run(
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
      userData.user.email
    );

    if (result.lastInsertRowid) {
      insertAffiliateLinks(affiliateLinks, id, userData.user.email);
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
  const { data: userData } = await supabase.auth.getUser(req.headers.authorization as string);
  const vacuumId = req.params.id;

  if (!userData?.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: "Missing data." });
  }

  if (!vacuumId) {
    return res.status(400).json({ error: "Missing id." });
  }

  const { affiliateLinks, ...dataWithoutAffiliateLinks } = data;

  const keys = Object.keys(dataWithoutAffiliateLinks);
  const values = Object.values(dataWithoutAffiliateLinks).map((value) => {
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }

    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return value;
  });

  try {
    if (keys.length) {
      const stmt = db.prepare(`
        UPDATE vacuums
        SET ${keys.map((key) => `${key} = ?`).join(", ")}
        WHERE id = ?
      `);

      stmt.run(...values, vacuumId);
    }

    if (affiliateLinks) {
      // Delete existing affiliate links
      const deleteStmt = db.prepare(`DELETE FROM affiliate_links WHERE vacuumId = ?`);
      deleteStmt.run(vacuumId);

      // Insert new affiliate links
      insertAffiliateLinks(affiliateLinks, vacuumId, userData.user.email);
    }

    res.json({ message: "Vacuum updated successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
