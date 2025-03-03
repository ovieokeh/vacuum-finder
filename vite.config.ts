// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    // Use 'node16' (or 'node18') for SSR builds, and 'esnext' for client
    target: isSsrBuild ? "node16" : "esnext",
  },
}));
