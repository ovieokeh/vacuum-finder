import { Request, Response } from "express";

import { db } from "../../database";

// Add a new vacuum affiliate link
export const addVacuumAffiliateLink = (req: Request, res: Response) => {
  const { vacuumId, region, currency, price, site, url } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO affiliate_links (
        vacuumId,
        region,
        currency,
        price,
        site,
        url
      ) VALUES (?,?,?,?,?,?)
    `);

    const result = stmt.run(vacuumId, region, currency, price, site, url);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a vacuum affiliate link by id
export const deleteVacuumAffiliateLink = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare(`DELETE FROM affiliate_links WHERE id = ?`);
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Affiliate link not found." });
    }

    res.json({ message: "Affiliate link deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a vacuum affiliate link by id
export const updateVacuumAffiliateLink = (req: Request, res: Response) => {
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
      UPDATE affiliate_links
      SET ${keys.map((key) => `${key} = ?`).join(", ")}
      WHERE id = ?
    `);

    const result = stmt.run(...values, data.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Affiliate link not found." });
    }

    res.json({ message: "Affiliate link updated successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
