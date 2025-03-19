import fs from "node:fs/promises";
import express, { Request, Response } from "express";
import { ViteDevServer } from "vite";
import { config } from "dotenv";

import { geolocateHandler } from "./src/api-handlers/geolocate";
import { enrichHandler } from "./src/api-handlers/enrich";

config();

const serveSitemaps = async (req: Request, res: Response) => {
  const sitemap = await fs.readFile("./dist/sitemap.xml", "utf-8");
  res.header("Content-Type", "application/xml");
  res.send(sitemap);
};

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
  // sitemaps
  app.get("/sitemap.xml", serveSitemaps);

  // serve favicon
  app.use("/favicon.svg", express.static("./public/favicon.svg"));

  app.use(express.json());

  // Utils endpoints
  app.get("/api/geolocate", geolocateHandler);
  app.get("/api/enrich-amazon", enrichHandler);

  // Serve HTML
  app.all("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");

      let template: string;
      let render: (url: string) => Promise<{ head?: string; html?: string }>;
      let html: string;

      if (!isProduction && vite) {
        // Always read fresh template in development
        template = await fs.readFile("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
        const rendered = await render(url);
        html = template.replace(`<!--app-head-->`, rendered.head ?? "").replace(`<!--app-html-->`, rendered.html ?? "");
      } else {
        template = templateHtml;
        // Use string concatenation to avoid static resolution during build
        html = templateHtml;
      }

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
