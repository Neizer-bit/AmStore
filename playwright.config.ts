import { defineConfig, devices } from "@playwright/test";

/**
 * Drives the running production build (`bun run start`) with real Chromium.
 * Kept separate from vitest, which owns the unit/contract suites.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
