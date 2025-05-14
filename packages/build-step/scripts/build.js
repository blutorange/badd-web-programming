// @ts-check

/** @import { BuildOptions } from "esbuild"; */

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
const srcDir = path.resolve(rootDir, "src");
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
 * Illustrates how to copy HTML files manually to the dist folder.
 * 
 * Not used anymore since we use esbuild to do the copy instead, this also
 * enables watch mode for HTML files.
 */
async function runCopyHtml() {
	const files = await fs.readdir(srcDir, { recursive: true });
	const htmlFiles = files.filter((file) => file.endsWith(".html"));
	const entries = htmlFiles.map((htmlFile) => {
		const sourceFile = path.resolve(srcDir, htmlFile);
		const relative = path.relative(srcDir, sourceFile);
		const targetFile = path.resolve(distDir, relative);
		return { sourceFile, targetFile };
	});

	// Create all directories first
	const folders = new Set(entries.map((e) => path.dirname(e.targetFile)));
	for (const dir of folders) {
		await fs.mkdir(dir, { recursive: true });
	}

	// Then copy all files in parallel
	await Promise.all(
		entries.map(async ({ sourceFile, targetFile }) => {
			console.log(`Copying <${sourceFile}> to <${targetFile}>`);
			await fs.copyFile(sourceFile, targetFile);
		}),
	);
}

/**
 * Builds JavaScript and CSS files via esbuild.
 */
async function runEsbuild() {
	/** @type {BuildOptions} */
	const options = {
		bundle: true,
		target: "es2020",
		minify: true,
		write: true,
		logLevel: "info",
		sourcemap: watch ? "inline" : undefined,
		loader: {
			".png": "file",
			".html": "copy",
		}
	};

	const entryPoints = await findEntryPoints();

	const config = {
		...options,
		entryPoints,
		outdir: "dist",
	};

	console.log("Running esbuild...");

	if (watch) {
		const context = await esbuild.context(config);
		await context.watch();
	} else {
		const buildResult = await esbuild.build(config);
		console.log(
			`Build finished with ${buildResult.errors.length} errors, ${buildResult.warnings.length} warnings`,
		);
	}
}


/**
 * Finds all entry points for the esbuild.
 * 
 * Entry points are all files whose name is index.js/index.css or that follow
 * the pattern page-xxx.js / page-xxx.css
 * 
 * Also, all HTML and images files are entry points that simply get copied to the dist folder.
 * @returns {Promise<string[]>} The entry points.
 */
async function findEntryPoints() {
	const entryPointPattern1 = /[\/\\](index|page-[a-zA-Z0-9]+)\.(js|css)$/;
	const entryPointPattern2 = /\.(png|html)$/;
	const files = await fs.readdir(srcDir, { recursive: true });
	return files
		.filter((file) => entryPointPattern1.test(file) || entryPointPattern2.test(file))
		.map((file) => path.resolve(srcDir, file))
		.map((file) => path.relative(rootDir, file));

}