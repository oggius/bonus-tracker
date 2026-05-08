import { execSync } from "node:child_process";
import path from "node:path";

async function globalSetup() {
  const repoRoot = path.resolve(__dirname, "../../../..");

  // Ensure deterministic credentials and rewards are present before e2e tests.
  execSync("pnpm --filter @bonus-tracker/db db:seed", {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

export default globalSetup;
