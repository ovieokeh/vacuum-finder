import { config } from "dotenv";
import { build } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

config();

const buildOpts = {
  entryPoints: ["src/entry-server.tsx"],
  bundle: true,
  platform: "node",
  target: "node16",
  outfile: "dist/server/entry-server.js",
  format: "esm",
  allowOverwrite: true,
  plugins: [
    nodeExternalsPlugin({
      allowList: ["redux-persist"],
    }),
  ],
  banner: {
    js: `
    import * as requireReact from 'react';
    import * as requireReactDOM from 'react-dom/server';

    function require(module) {
      if (module === 'react') return requireReact;
      if (module === 'react-dom/server') return requireReactDOM;
    }
    `,
  },
};

// Build Express server
build({
  ...buildOpts,
  entryPoints: ["server.ts"],
  bundle: true,
  platform: "node",
  target: "node16",
  outfile: "dist/server/server.js",
}).catch(() => process.exit(1));

// Build SSR render bundle
build({
  ...buildOpts,
  entryPoints: ["src/entry-server.tsx"],
  outfile: "dist/server/entry-server.js",
  format: "esm",
}).catch(() => process.exit(1));
