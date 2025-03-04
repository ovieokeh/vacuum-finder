import fs from "node:fs/promises";
import express from "express";
// import { populateMockData, setupDatabase } from "./src/database/setup";
import { ViteDevServer } from "vite";
import { createVacuumHandler, deleteVacuumHandler, updateVacuumHandler } from "./src/api-handlers/vacuums/admin";
import { getVacuum, listVacuums, searchVacuums } from "./src/api-handlers/vacuums/public";

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const port = process.env.PORT || 5173;
  const base = process.env.BASE || "/";

  // In production, cache client template HTML
  const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";

  const app = express();
  /** @type {ViteDevServer | undefined} */
  let vite: ViteDevServer | undefined;

  if (!isProduction) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base,
    });
    app.use(vite.middlewares);
  } else {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(base, sirv("./dist/client", { extensions: [] }));
  }

  app.use(express.json());

  // API endpoints…
  app.post("/api/vacuums", createVacuumHandler);
  app.put("/api/vacuums/:id", updateVacuumHandler as any);
  app.delete("/api/vacuums/:id", deleteVacuumHandler as any);
  app.get("/api/vacuums", listVacuums);
  app.get("/api/vacuums/:id", getVacuum);
  app.post("/api/search-vacuums", searchVacuums);

  // Serve HTML
  app.all("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");

      let template: string;
      let render: (url: string) => Promise<{ head?: string; html?: string }>;

      if (!isProduction && vite) {
        // Always read fresh template in development
        template = await fs.readFile("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = templateHtml;
        // Use string concatenation to avoid static resolution during build
        render = (await import("./" + "dist/server/entry-server.js")).render;
      }

      const rendered = await render(url);
      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? "")
        .replace(`<!--app-html-->`, rendered.html ?? "");

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    // setupDatabase();
    // populateMockData();
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
