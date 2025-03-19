import { Request, Response } from "express";

// Geolocate a user by IP address
export const enrichHandler = async (req: Request, res: Response) => {
  const link = req.query.link as string;
  const enricherURL = process.env.ENRICHER_API_URL;

  try {
    const response = await fetch(`${enricherURL}/enrich-amazon?link=${link}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to enrich the link." });
  }
};
