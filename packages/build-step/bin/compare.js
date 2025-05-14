// @ts-check

import fs from "node:fs/promises";
import { setDiff, setIntersect } from "../src/js/set-utils.js";

async function main() {
  if (process.argv.length !== 4) {
    console.log(`Usage: ${process.argv[0]} ${process.argv[1]} <source> <target>`);
    console.log("  Compares the contents of the files in the source and target folder");
    return;
  }

  const sourceFolder = process.argv[2];
  const targetFolder = process.argv[3];

  const sourceContents = await fs.readdir(sourceFolder, { recursive: true });
  const targetContents = await fs.readdir(targetFolder, { recursive: true });

  const sourceSet = new Set(sourceContents);
  const targetSet = new Set(targetContents);

  const onlyInSource = setDiff(sourceSet, targetSet);
  const onlyInTarget = setDiff(targetSet, sourceSet);
  const commonFiles = setIntersect(sourceSet, targetSet);

  if (onlyInSource.size > 0) {
    console.log("Files only in source that do not exist in target:");
    for (const item of onlyInSource) {
      console.log(`  - ${item}`)
    }
  }

  if (onlyInTarget.size > 0) {
    console.log("Files only in target that do not exist in source:");
    for (const item of onlyInTarget) {
      console.log(`  - ${item}`)
    }
  }

  if (commonFiles.size > 0) {
    console.log("Files that exist in both folders:");
    for (const item of commonFiles) {
      console.log(`  - ${item}`)
    }
  }
}

try {
  await main();
} catch(e) {
  console.error("Failed to run script", e);
  process.exit(1);
}
