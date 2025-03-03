import { Request, Response } from "express";
import { db } from "../../database";

export const listVacuums = async (_req: Request, res: Response) => {
  const stmt = db.prepare("SELECT * FROM vacuums");
  const vacuums = stmt.all();
  res.json(vacuums);
};

export const getVacuum = async (req: Request, res: Response) => {
  const stmt = db.prepare("SELECT * FROM vacuums WHERE id = ?");
  const vacuum = stmt.get(req.params.id);
  res.json(vacuum);
};

export const searchVacuums = async (req: Request, res: Response) => {
  const { budget, mopFunction, numPets } = req.body;

  const petHair = numPets > 0 ? 1 : 0;

  const query = `
    SELECT * FROM vacuums
    WHERE 
      (? IS NULL OR price <= ?)
      AND (? IS NULL OR mopFunction = ?)
      AND (? IS NULL OR petHair = ?)
  `;

  // For each condition we supply the filter value twice:
  const stmt = db.prepare(query);
  const vacuums = stmt.all(budget, budget, mopFunction, mopFunction, petHair, petHair);

  res.json(vacuums);
};
