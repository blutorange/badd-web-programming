import type { BuildOptions } from "esbuild";

import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// paths and options
const watch = process.argv.includes("--watch");
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.resolve(rootDir, "dist");

// main build job
try {
  await main();
} catch (e) {
  console.error("Failed to run build script", e);
  process.exit(1);
}

async function main() {
  await runClean();
  await runEsbuild();
}

/**
 * Removes the dist folder.
 */
async function runClean() {
  console.log(`Removing <${distDir}>`);
  await fs.rm(distDir, { force: true, recursive: true });
}

/**
 * Builds JavaScript and CSS files via esbuild.
 */
async function runEsbuild() {
  const options: BuildOptions = {
    bundle: true,
    target: "es2020",
    minify: !watch,
    write: true,
    logLevel: "info",
    sourcemap: watch ? "inline" : undefined,
    entryPoints: ["src/main.ts"],
    outdir: "dist",
    define: {
      "import.meta.url": "document.location.href",
    },
    loader: {
      ".png": "base64",
    },
  };

  console.log("Running esbuild...");

  if (watch) {
    const context = await esbuild.context(options);
    await context.watch();
  } else {
    const buildResult = await esbuild.build(options);
    console.log(
      `Build finished with ${buildResult.errors.length} errors, ${buildResult.warnings.length} warnings`,
    );
  }
}
