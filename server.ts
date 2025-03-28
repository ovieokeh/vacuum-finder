import fs from "node:fs/promises";
import express, { Request, Response } from "express";
import { ViteDevServer } from "vite";
import { config } from "dotenv";

import { geolocateHandler } from "./src/api-handlers/geolocate";
import { enrichHandler } from "./src/api-handlers/enrich";
import { emailCaptureHandler } from "./src/api-handlers/email-capture";

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
  app.get("/api/email-capture", emailCaptureHandler);

  // Serve HTML
  app.all("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      let html: string;

      if (!isProduction && vite) {
        let template = await fs.readFile("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const rendered = await render(url);
        html = template.replace(`<!--app-head-->`, rendered.head ?? "").replace(`<!--app-html-->`, rendered.html ?? "");
      } else {
        const template = templateHtml; // Cached HTML from "./dist/client/index.html"

        const manifestContent = await fs.readFile("./dist/client/.vite/manifest.json", "utf8");
        const manifest = JSON.parse(manifestContent);

        const clientEntry = manifest["index.html"];
        if (!clientEntry) {
          throw new Error("Client entry not found in manifest.");
        }

        // Build the URLs for JS and CSS assets
        const clientScriptUrl = `${base}${clientEntry.file}`;
        const clientCssLinks = clientEntry.css
          ? clientEntry.css.map((cssFile: string) => `<link rel="stylesheet" href="${base}${cssFile}" />`).join("\n")
          : "";

        // Run SSR render to get HTML and head content
        const { render } = await import("" + "./entry-server.js");
        const rendered = await render(req.originalUrl.replace(base, ""));

        // Replace placeholders in template
        html = template
          .replace(`<!--app-head-->`, `${rendered.head ?? ""}\n${clientCssLinks}`)
          .replace(`<!--app-html-->`, rendered.html ?? "")
          .replace(`<!--app-script-->`, `<script type="module" src="${clientScriptUrl}"></script>`);
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
