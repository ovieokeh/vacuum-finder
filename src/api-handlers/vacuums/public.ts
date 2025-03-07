import { Request, Response } from "express";

import { db, supabase } from "../../database";

export const listVacuums = async (req: Request, res: Response) => {
  const { data: user } = await supabase.auth.getUser(req.headers.authorization as string);
  const { owned } = req.query;

  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const baseQuery = `
      FROM vacuums v
      LEFT JOIN affiliate_links al ON al.vacuumId = v.id
    `;
    let whereClause = "";
    const queryParams: any[] = [];

    // If "owned" is true, filter by user email
    if (owned === "true" && user.user) {
      whereClause = `WHERE v.addedBy = ?`;
      queryParams.push(user.user.email);
    }

    // 2a) Count how many total vacuums match
    const countQuery = `SELECT COUNT(DISTINCT v.id) as total ${baseQuery} ${whereClause}`;
    const countResult = db.prepare(countQuery).get(...queryParams) as any;
    const total = countResult?.total || 0;

    // 3) Get vacuum rows with limit/offset
    const mainQuery = `
      SELECT 
        v.*,
        al.id AS affiliateLinkId,
        al.region,
        al.currency,
        al.price,
        al.site,
        al.url
      ${baseQuery}
      ${whereClause}
      LIMIT ? OFFSET ?
    `;
    // append limit and offset to the query params
    const rows = db.prepare(mainQuery).all(...queryParams, limit, offset);

    // 4) Group rows by vacuum id and nest affiliate link details
    const vacuumMap: { [id: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        delete vacuumMap[vacuumId].affiliateLinkId;
        delete vacuumMap[vacuumId].region;
        delete vacuumMap[vacuumId].currency;
        delete vacuumMap[vacuumId].price;
        delete vacuumMap[vacuumId].site;
        delete vacuumMap[vacuumId].url;
      }
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

    // 5) Convert numeric booleans (0/1) to true/false
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = !!vacuum[key];
        }
        if (key === "otherFeatures") {
          vacuum[key] = JSON.parse(vacuum[key]);
        }
      });
    });

    // 6) Return paginated response
    res.json({
      data: vacuums,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
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

    const vacuum: any = { ...rows[0], affiliateLinks: [] };
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

    Object.keys(vacuum).forEach((key) => {
      if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
        vacuum[key] = !!vacuum[key];
      }
      if (key === "otherFeatures") {
        vacuum[key] = JSON.parse(vacuum[key]);
      }
    });

    res.json(vacuum);
  } catch (error) {
    console.error("Error fetching vacuum:", error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const searchVacuums = async (req: Request, res: Response) => {
  const { model, brand } = req.query;

  console.log("Searching vacuums with model:", model, "and brand:", brand);

  // Parse pagination params
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // Build WHERE conditions
    // We’ll handle the “IS NULL or LIKE” logic for each param
    // For total counting, we do a separate query:
    const baseWhere = `
      WHERE (? IS NULL OR v.model LIKE ?)
      AND (? IS NULL OR v.brand LIKE ?)
    `;
    // Prepare the query params
    const queryParams = [model || null, model ? `%${model}%` : null, brand || null, brand ? `%${brand}%` : null];

    // 1) Count how many total vacuums match
    const countQuery = `
      SELECT COUNT(DISTINCT v.id) as total
      FROM vacuums v
      LEFT JOIN affiliate_links al ON al.vacuumId = v.id
      ${baseWhere}
    `;
    const countResult = db.prepare(countQuery).get(...queryParams) as any;
    const total = countResult?.total || 0;

    // 2) Select actual rows with limit/offset
    const mainQuery = `
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
      ${baseWhere}
      LIMIT ? OFFSET ?
    `;
    // Add limit/offset to the end of query params
    const rows = db.prepare(mainQuery).all(...queryParams, limit, offset);

    // Group results
    const vacuumMap: { [key: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        delete vacuumMap[vacuumId].affiliateLinkId;
        delete vacuumMap[vacuumId].region;
        delete vacuumMap[vacuumId].currency;
        delete vacuumMap[vacuumId].price;
        delete vacuumMap[vacuumId].site;
        delete vacuumMap[vacuumId].url;
      }
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

    // Convert numeric booleans
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = !!vacuum[key];
        }
        if (key === "otherFeatures") {
          vacuum[key] = JSON.parse(vacuum[key]);
        }
      });
    });

    // Return with pagination meta
    res.json({
      data: vacuums,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error searching vacuums:", error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const filterVacuums = async (req: Request, res: Response) => {
  try {
    const { budget, mopFunction: mopFunctionBool, currency } = req.body;
    const mopFunction = mopFunctionBool ? 1 : null;

    // Parse pagination params
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    // We’ll add mop & affiliate link filtering in both the total count query and the main query
    const baseWhere = `
      WHERE (? IS NULL OR v.hasMoppingFeature = ?)
      AND (
        al.id IS NOT NULL
        OR NOT EXISTS (
          SELECT 1 FROM affiliate_links WHERE vacuumId = v.id
        )
      )
    `;

    const whereParams = [mopFunction, mopFunction];

    // 1) Count total
    const countQuery = `
      SELECT COUNT(DISTINCT v.id) as total
      FROM vacuums v
      LEFT JOIN affiliate_links al 
        ON al.vacuumId = v.id 
        AND al.currency = ?
        AND al.price <= ?
      ${baseWhere}
    `;
    const countResult = db.prepare(countQuery).get(currency, budget, ...whereParams) as any;
    const total = countResult?.total || 0;

    // 2) Fetch data with limit/offset
    const mainQuery = `
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
      ${baseWhere}
      LIMIT ? OFFSET ?
    `;
    const rows = db.prepare(mainQuery).all(currency, budget, ...whereParams, limit, offset);

    // Group rows by vacuum id
    const vacuumMap: { [key: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        delete vacuumMap[vacuumId].affiliateLinkId;
        delete vacuumMap[vacuumId].region;
        delete vacuumMap[vacuumId].currency;
        delete vacuumMap[vacuumId].price;
        delete vacuumMap[vacuumId].site;
        delete vacuumMap[vacuumId].url;
      }
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

    // Convert numeric booleans
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = !!vacuum[key];
        }
        if (key === "otherFeatures") {
          vacuum[key] = JSON.parse(vacuum[key]);
        }
      });
    });

    // Respond with pagination
    res.json({
      data: vacuums,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error filtering vacuums:", error);
    res.status(500).json({ error: (error as any).message });
  }
};

export const listVacuumBrands = async (req: Request, res: Response) => {
  try {
    // Fetch distinct brands in alphabetical order
    const query = `
      SELECT DISTINCT brand
      FROM vacuums
      WHERE brand IS NOT NULL
      ORDER BY brand ASC
    `;
    const rows = db.prepare(query).all();

    // rows might look like [{ brand: 'BrandA' }, { brand: 'BrandB' }, ...]
    // Map them to an array of brand strings
    const brands = rows.map((row) => (row as any).brand);

    res.json({ brands });
  } catch (error) {
    console.error("Error fetching vacuum brands:", error);
    res.status(500).json({ error: (error as any).message });
  }
};
