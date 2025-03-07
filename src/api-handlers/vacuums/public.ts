import { Request, Response } from "express";

import { db, supabase } from "../../database";

export const listVacuums = async (req: Request, res: Response) => {
  const { data: user } = await supabase.auth.getUser(req.headers.authorization as string);
  const { owned } = req.query;

  try {
    // LEFT JOIN to include affiliate link details even if a vacuum has none.
    let query = `
      SELECT 
        v.*,
        al.id AS affiliateLinkId,
        al.region,
        al.currency,
        al.price,
        al.site,
        al.url
      FROM vacuums v
      LEFT JOIN affiliate_links al ON al.vacuumId = v.id
    `;

    let rows: unknown[] = [];
    if (owned === "true" && user.user) {
      query += ` WHERE v.addedBy = ?`;
      rows = db.prepare(query).all(user.user.email);
    } else {
      rows = db.prepare(query).all();
    }

    // Group rows by vacuum id and nest affiliate link details in an 'affiliateLinks' array.
    const vacuumMap: { [id: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        // Initialize vacuum and remove affiliate link columns.
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        delete vacuumMap[vacuumId].affiliateLinkId;
        delete vacuumMap[vacuumId].region;
        delete vacuumMap[vacuumId].currency;
        delete vacuumMap[vacuumId].price;
        delete vacuumMap[vacuumId].site;
        delete vacuumMap[vacuumId].url;
      }
      // If affiliate link data exists, push it into the affiliateLinks array.
      if (row.affiliateLinkId) {
        vacuumMap[vacuumId].affiliateLinks.push({
          id: row.affiliateLinkId,
          region: row.region,
          currency: row.currency,
          price: row.price,
          site: row.site,
          url: row.url,
        });
      }
    });

    const vacuums = Object.values(vacuumMap);

    // Convert numeric booleans (0/1) to true/false.
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = !!vacuum[key];
        }
      });
    });

    res.json(vacuums);
  } catch (error) {
    console.error("Error listing vacuums:", error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const getVacuum = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        v.*,
        al.id AS affiliateLinkId,
        al.region,
        al.currency,
        al.price,
        al.site,
        al.url
      FROM vacuums v
      LEFT JOIN affiliate_links al ON al.vacuumId = v.id
      WHERE v.id = ?
    `;
    const rows = db.prepare(query).all(req.params.id) as any[];

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: "Vacuum not found" });
      return;
    }

    // Since a vacuum may have multiple affiliate links, group them.
    const vacuum: any = { ...rows[0], affiliateLinks: [] };
    // Remove affiliate link fields from the vacuum.
    delete vacuum.affiliateLinkId;
    delete vacuum.region;
    delete vacuum.currency;
    delete vacuum.price;
    delete vacuum.site;
    delete vacuum.url;

    rows.forEach((row) => {
      if (row.affiliateLinkId) {
        vacuum.affiliateLinks.push({
          id: row.affiliateLinkId,
          region: row.region,
          currency: row.currency,
          price: row.price,
          site: row.site,
          url: row.url,
        });
      }
    });

    // Convert numeric booleans (0/1) to true/false.
    Object.keys(vacuum).forEach((key) => {
      if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
        vacuum[key] = !!vacuum[key];
      }
    });

    res.json(vacuum);
  } catch (error) {
    console.error("Error fetching vacuum:", error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const searchVacuums = async (req: Request, res: Response) => {
  try {
    const { budget, mopFunction: mopFunctionBool, currency } = req.body;
    const mopFunction = mopFunctionBool ? 1 : null;

    // This query uses a LEFT JOIN to include affiliate link details only if they match the currency and price criteria.
    // It returns a row for each vacuum and its matching affiliate link (if any). If there’s no matching affiliate link,
    // the affiliate link columns will be null. The WHERE clause ensures:
    // - The mop feature filter is applied.
    // - Vacuums are returned if they have at least one matching affiliate link OR if they have no affiliate links at all.
    const query = `
      SELECT 
        v.*,
        al.id AS affiliateLinkId,
        al.region,
        al.currency,
        al.price,
        al.site,
        al.url
      FROM vacuums v
      LEFT JOIN affiliate_links al 
        ON al.vacuumId = v.id 
        AND al.currency = ?
        AND al.price <= ?
      WHERE (? IS NULL OR v.hasMoppingFeature = ?)
      AND (
        al.id IS NOT NULL
        OR NOT EXISTS (
          SELECT 1 FROM affiliate_links WHERE vacuumId = v.id
        )
      )
    `;

    const stmt = db.prepare(query);
    const rows = stmt.all(currency, budget, mopFunction, mopFunction);

    // Group rows by vacuum id and nest affiliate link details in an 'affiliateLinks' array.
    const vacuumMap: { [key: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        // Initialize the vacuum object and remove affiliate link fields.
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        delete vacuumMap[vacuumId].affiliateLinkId;
        delete vacuumMap[vacuumId].region;
        delete vacuumMap[vacuumId].currency;
        delete vacuumMap[vacuumId].price;
        delete vacuumMap[vacuumId].site;
        delete vacuumMap[vacuumId].url;
      }
      // If this row has affiliate link data, add it to the array.
      if (row.affiliateLinkId) {
        vacuumMap[vacuumId].affiliateLinks.push({
          id: row.affiliateLinkId,
          region: row.region,
          currency: row.currency,
          price: row.price,
          site: row.site,
          url: row.url,
        });
      }
    });

    const vacuums = Object.values(vacuumMap);

    // Convert numeric booleans (0/1) to true/false
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = !!vacuum[key];
        }
      });
    });

    res.json(vacuums);
  } catch (error) {
    console.error("Error searching vacuums:", error);
    res.status(500).json({ error: (error as any).message });
  }
};
