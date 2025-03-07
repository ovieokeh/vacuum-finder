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
    const queryParams = [model || null, model ? `%${model}%` : null, brand || null, brand ? `${brand}` : null];

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
    // Extract filters from the request body.
    // Expecting filters for all VacuumBase fields plus affiliate filters.
    const {
      // String fields
      brand,
      mappingTechnology,
      // Numeric fields (using “min” or “max” where it makes sense)
      minBatteryLifeInMinutes,
      minSuctionPowerInPascals,
      maxNoiseLevelInDecibels,
      minWaterTankCapacityInLiters,
      minDustbinCapacityInLiters,
      // Array field
      otherFeatures,
      // Affiliate filtering: budget and region.
      // NOTE: Do not filter by currency – only by price.
      budget,
      // region,
    } = req.body;

    // Parse pagination parameters.
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = (page - 1) * limit;

    // Build dynamic filtering conditions and corresponding parameters.
    const conditions: string[] = [];
    const params: any[] = [];

    // --- VacuumBase string filters ---
    if (brand && brand.length > 0) {
      conditions.push("v.brand = ?");
      params.push(brand);
    }
    if (mappingTechnology) {
      conditions.push("v.mappingTechnology = ?");
      params.push(mappingTechnology);
    }

    // --- VacuumBase numeric filters ---
    if (minBatteryLifeInMinutes) {
      conditions.push("v.batteryLifeInMinutes >= ?");
      params.push(minBatteryLifeInMinutes);
    }
    if (minSuctionPowerInPascals) {
      conditions.push("v.suctionPowerInPascals >= ?");
      params.push(minSuctionPowerInPascals);
    }
    if (maxNoiseLevelInDecibels) {
      conditions.push("v.noiseLevelInDecibels <= ?");
      params.push(maxNoiseLevelInDecibels);
    }
    if (minWaterTankCapacityInLiters) {
      // Cast in case the value is stored as a string.
      conditions.push("CAST(v.waterTankCapacityInLiters AS REAL) >= ?");
      params.push(minWaterTankCapacityInLiters);
    }
    if (minDustbinCapacityInLiters) {
      conditions.push("CAST(v.dustbinCapacityInLiters AS REAL) >= ?");
      params.push(minDustbinCapacityInLiters);
    }

    // --- VacuumBase boolean filters ---
    const booleanProps: (keyof typeof req.body)[] = [
      "hasMoppingFeature",
      "hasSelfEmptyingFeature",
      "hasZoneCleaningFeature",
      "hasMultiFloorMappingFeature",
      "hasCarpetBoostFeature",
      "hasVirtualWallsFeature",
      "hasSmartHomeIntegration",
      "hasVoiceControl",
      "hasAppControl",
      "hasRemoteControl",
      "hasManualControl",
    ];
    for (const prop of booleanProps) {
      if (req.body[prop] !== undefined) {
        conditions.push(`v.${prop.toString() as string} = ?`);
        // Assuming booleans are stored as 0/1 in the DB.
        params.push(req.body[prop] ? 1 : 0);
      }
    }

    // --- VacuumBase array filter for "otherFeatures" ---
    // We assume "otherFeatures" is stored as a JSON string.
    if (otherFeatures && Array.isArray(otherFeatures) && otherFeatures.length > 0) {
      otherFeatures.forEach((feature: string) => {
        conditions.push("v.otherFeatures LIKE ?");
        params.push(`%${feature}%`);
      });
    }

    // --- Affiliate link filtering (by price and region only) ---
    // For region "Global", include vacuums that either have an affiliate link under budget
    // OR have no affiliate link at all.
    // if (region === "Global") {
    //   conditions.push(
    //     "((al.id IS NOT NULL AND al.price <= ?) OR (NOT EXISTS (SELECT 1 FROM affiliate_links WHERE vacuumId = v.id)))"
    //   );
    //   params.push(budget);
    // } else {
    //   // For specific regions, require an affiliate link with a matching region and price under budget.
    //   conditions.push("al.id IS NOT NULL");
    //   conditions.push("al.region = ?");
    // }
    if (budget && !isNaN(budget) && budget > 0) {
      conditions.push("al.price <= ?");
      params.push(budget);
    }

    // Combine all conditions into one WHERE clause.
    const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // Build the count query.
    const countQuery = `
      SELECT COUNT(DISTINCT v.id) as total
      FROM vacuums v
      LEFT JOIN affiliate_links al ON al.vacuumId = v.id
      ${whereClause}
    `;

    // Build the main query, selecting affiliate link details if available.
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
      ${whereClause}
      LIMIT ? OFFSET ?
    `;
    // Append pagination parameters for the main query.
    const mainParams = [...params, limit, offset];

    console.log("Filtering vacuums with query:", mainQuery, mainParams);
    // Execute the queries.
    const countResult = db.prepare(countQuery).get(...params) as any;
    const total = countResult?.total || 0;
    const rows = db.prepare(mainQuery).all(...mainParams);

    // Group rows by vacuum id and merge affiliate link data.
    const vacuumMap: { [key: string]: any } = {};
    rows.forEach((row: any) => {
      const vacuumId = row.id;
      if (!vacuumMap[vacuumId]) {
        vacuumMap[vacuumId] = { ...row, affiliateLinks: [] };
        // Remove affiliate link columns from the vacuum record.
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

    // Post-process: convert numeric booleans to true/false and parse JSON for otherFeatures.
    vacuums.forEach((vacuum: any) => {
      Object.keys(vacuum).forEach((key) => {
        if (typeof vacuum[key] === "number" && [0, 1].includes(vacuum[key])) {
          vacuum[key] = Boolean(vacuum[key]);
        }
        if (key === "otherFeatures" && typeof vacuum[key] === "string") {
          try {
            vacuum[key] = JSON.parse(vacuum[key]);
          } catch {
            // If parsing fails, leave the value as-is.
          }
        }
      });
    });

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
