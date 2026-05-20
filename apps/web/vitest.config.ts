import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    environmentMatchGlobs: [["tests/unit/**/*.dom.test.{ts,tsx}", "happy-dom"]],
  },
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "tests/unit/stubs/server-only.ts"),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
});
