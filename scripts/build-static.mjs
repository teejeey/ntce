import { existsSync, renameSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const rootDir = process.cwd();
const apiDir = path.join(rootDir, "app", "api");
const tmpApiDir = path.join(rootDir, "_api_tmp_export");

let moved = false;

function moveIfExists(from, to) {
  if (existsSync(from)) {
    try {
      renameSync(from, to);
    } catch (err) {
      if (err && err.code === "EPERM") {
        throw new Error(
          "Could not move app/api because files are in use. Stop `npm run dev` terminals and run `npm run build:static` again."
        );
      }
      throw err;
    }
    return true;
  }
  return false;
}

function restoreIfNeeded() {
  if (moved && existsSync(tmpApiDir)) {
    renameSync(tmpApiDir, apiDir);
  }
}

try {
  moved = moveIfExists(apiDir, tmpApiDir);

  const child = spawn("npm", ["run", "build"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, NEXT_EXPORT: "1" },
  });

  child.on("exit", (code) => {
    try {
      restoreIfNeeded();
    } catch (err) {
      console.error("Failed to restore app/api:", err);
      process.exit(1);
    }
    process.exit(code ?? 1);
  });

  child.on("error", (err) => {
    try {
      restoreIfNeeded();
    } catch (restoreErr) {
      console.error("Failed to restore app/api:", restoreErr);
    }
    console.error("Failed to run static build:", err);
    process.exit(1);
  });
} catch (err) {
  try {
    restoreIfNeeded();
  } catch (restoreErr) {
    console.error("Failed to restore app/api:", restoreErr);
  }
  console.error("Static build preparation failed:", err);
  process.exit(1);
}
