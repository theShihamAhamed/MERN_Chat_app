import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const srcDir = path.resolve("src");

const getJsFiles = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) return getJsFiles(fullPath);
    return fullPath.endsWith(".js") ? [fullPath] : [];
  });

const files = getJsFiles(srcDir);

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Syntax check passed for ${files.length} backend files.`);
