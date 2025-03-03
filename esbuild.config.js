import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

build({
  entryPoints: ["server.ts"],
  bundle: true,
  platform: "node",
  target: "node16",
  outfile: "dist/server/server.js",
  format: "esm", // Output as an ES module
  plugins: [nodeExternalsPlugin()],
}).catch(() => process.exit(1));
