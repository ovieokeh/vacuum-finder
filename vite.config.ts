import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import { config } from "dotenv";

import { db } from "./src/database";
import { Vacuum } from "./src/types";

config();

const buildRoutes = () => {
  const routes: string[] = ["/", "/privacy-policy", "/terms-of-service", "/guides", "/vacuums"];

  try {
    const vacuums = db.prepare("SELECT * FROM vacuums").all();
    vacuums.forEach((vacuum) => {
      const typedVacuum = vacuum as Vacuum;
      if (typedVacuum.id) {
        routes.push(`/vacuums/${typedVacuum.id}`);
      }
    });
  } catch (e) {
    console.error("Error building routes", e.message);
  }

  // @todo add guides routes

  return routes;
};

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [tailwindcss(), react(), Sitemap({ readable: true, dynamicRoutes: buildRoutes() })],
  build: {
    // Use 'node16' (or 'node18') for SSR builds, and 'esnext' for client
    target: isSsrBuild ? "node16" : "esnext",
  },
}));
