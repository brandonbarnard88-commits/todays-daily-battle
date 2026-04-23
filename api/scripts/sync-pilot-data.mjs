import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const fromDir = join(root, "..", "next-app", "data");
const toDir = join(root, "src", "pilot-data");
const files = [
  "canon-daily-verse.json",
  "battle-plans.json",
  "calm-moods.json",
];

await mkdir(toDir, { recursive: true });
for (const f of files) {
  await copyFile(join(fromDir, f), join(toDir, f));
}
console.log("synced next-app/data → api/src/pilot-data/");
