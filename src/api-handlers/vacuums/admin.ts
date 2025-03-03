import { Request, Response } from "express";
import { db } from "../../database";

// Add a new vacuum
export const createVacuumHandler = (req: Request, res: Response) => {
  const {
    id,
    name,
    image,
    brand,
    model,
    price,
    batteryLifeMins,
    suctionPowerPa,
    noiseLevelDb,
    mappingTechnology,
    multiFloorMapping,
    virtualWalls,
    mopFunction,
    selfEmptying,
    appControl,
    petHair,
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO vacuums (
        id, name, image, brand, model, price, batteryLifeMins,
        suctionPowerPa, noiseLevelDb, mappingTechnology,
        multiFloorMapping, virtualWalls, mopFunction, selfEmptying,
        appControl, petHair
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      id,
      name,
      image,
      brand,
      model,
      price,
      batteryLifeMins,
      suctionPowerPa,
      noiseLevelDb,
      mappingTechnology,
      multiFloorMapping,
      virtualWalls,
      mopFunction,
      selfEmptying,
      appControl,
      petHair
    );
    res.status(201).json({ message: "Vacuum added successfully." });
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

// Update an existing vacuum by id
export const updateVacuumHandler = (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    image,
    brand,
    model,
    price,
    batteryLifeMins,
    suctionPowerPa,
    noiseLevelDb,
    mappingTechnology,
    multiFloorMapping,
    virtualWalls,
    mopFunction,
    selfEmptying,
    appControl,
    petHair,
  } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE vacuums SET
        name = ?,
        image = ?,
        brand = ?,
        model = ?,
        price = ?,
        batteryLifeMins = ?,
        suctionPowerPa = ?,
        noiseLevelDb = ?,
        mappingTechnology = ?,
        multiFloorMapping = ?,
        virtualWalls = ?,
        mopFunction = ?,
        selfEmptying = ?,
        appControl = ?,
        petHair = ?
      WHERE id = ?
    `);
    const result = stmt.run(
      name,
      image,
      brand,
      model,
      price,
      batteryLifeMins,
      suctionPowerPa,
      noiseLevelDb,
      mappingTechnology,
      multiFloorMapping,
      virtualWalls,
      mopFunction,
      selfEmptying,
      appControl,
      petHair,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Vacuum not found or no changes made." });
    }

    res.json({ message: "Vacuum updated successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
