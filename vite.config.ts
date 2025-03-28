import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://cevxzvsqlweccdszjadm.supabase.co",
  process.env.VITE_SUPABASE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldnh6dnNxbHdlY2Nkc3pqYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNzA1NjksImV4cCI6MjA1Njg0NjU2OX0.hdzjvJu1pekfhZbFI4rdvWqZi6llKsc9cNAkglkqToI"
);

const buildRoutes = () => {
  const routes: string[] = [
    "/",
    "/privacy-policy",
    "/terms-of-service",
    // "/guides",
    "/vacuums",
  ];

  try {
    supabase
      .from("Vacuums")
      .select("id")
      .select()
      .then(({ data }) => {
        data?.forEach((vacuum) => {
          const typedVacuum = vacuum as any;
          if (typedVacuum.id) {
            routes.push(`/vacuums/${typedVacuum.id}`);
          }
        });
      });
  } catch (e) {
    console.error("Error building routes", e.message);
  }

  // @todo add guides routes

  return routes;
};

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss(), react(), Sitemap({ generateRobotsTxt: true, dynamicRoutes: buildRoutes() })],
  build: {
    manifest: true,
    outDir: "dist/client",
    // Use 'node16' (or 'node18') for SSR builds, and 'esnext' for client
    target: isSsrBuild ? "node16" : "esnext",
  },
}));
