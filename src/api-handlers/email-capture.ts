import { Request, Response } from "express";
import { supabase } from "../database";
import { config } from "dotenv";

config();

// Capture an email address
export const emailCaptureHandler = async (req: Request, res: Response) => {
  const email = req.query.email as string;

  try {
    await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_EMAIL!,
      password: process.env.SUPABASE_PASSWORD!,
    });

    const response = await supabase.from("Emails").insert([{ email }]).single();

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to capture email." });
  } finally {
    await supabase.auth.signOut();
  }
};
