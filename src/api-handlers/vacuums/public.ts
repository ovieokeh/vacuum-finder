import { Request, Response } from "express";
import { db } from "../../database";
import { Vacuum } from "../../types";

export const listVacuums = async (_req: Request, res: Response) => {
  const stmt = db.prepare("SELECT * FROM vacuums");
  const vacuums = stmt.all();
  res.json(vacuums);
};

export const getVacuum = async (req: Request, res: Response) => {
  const stmt = db.prepare("SELECT * FROM vacuums WHERE id = ?");
  const vacuum = stmt.get(req.params.id) as Vacuum & {
    [key: string]: any;
  };

  if (!vacuum) {
    res.status(404).json({ error: "Vacuum not found" });
  } else {
    // convert all 1/0 to true/false
    Object.keys(vacuum).forEach((key) => {
      if ([0, 1].includes(vacuum[key])) {
        vacuum[key] = !!vacuum[key];
      }
    });

    res.json(vacuum);
  }
};

export const searchVacuums = async (req: Request, res: Response) => {
  try {
    const { budget, mopFunction: mopFunctionBool, numPets } = req.body;

    const petHair = numPets > 0 ? 1 : null;
    const mopFunction = mopFunctionBool ? 1 : null;

    const query = `
    SELECT * FROM vacuums
    WHERE 
    (? IS NULL OR price <= ?)
    AND (? IS NULL OR petHair = ?)
    AND (? IS NULL OR mopFunction = ?)
    `;

    // For each condition we supply the filter value twice:
    const stmt = db.prepare(query);
    const vacuums = (stmt.all(budget, budget, petHair, petHair, mopFunction, mopFunction) as Vacuum[]) ?? [];

    // convert all 1/0 to true/false
    vacuums.forEach((vacuum) => {
      vacuum.mopFunction = !!vacuum.mopFunction;
      vacuum.petHair = !!vacuum.petHair;
      vacuum.virtualWalls = !!vacuum.virtualWalls;
      vacuum.selfEmptying = !!vacuum.selfEmptying;
      vacuum.appControl = !!vacuum.appControl;
      vacuum.multiFloorMapping = !!vacuum.multiFloorMapping;
    });

    res.json(vacuums);
  } catch (error) {
    console.error("Error searching vacuums:", error);
    res.status(500).json({ error: (error as any).message });
  }
};
