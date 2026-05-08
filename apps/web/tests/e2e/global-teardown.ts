import { execSync } from "node:child_process";
import path from "node:path";

async function globalTeardown() {
  const repoRoot = path.resolve(__dirname, "../../../..");

  // Always restore local DB to seed baseline after test run (pass/fail).
  execSync("pnpm --filter @bonus-tracker/db exec prisma migrate reset --force --skip-generate", {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

export default globalTeardown;
