import { defineConfig, devices } from "@playwright/test";

/**
 * E2E + accessibility suite. Runs against a production build (`next start`),
 * which reads the committed content JSON with no Tina backend — the same way
 * the site deploys. Locally, `reuseExistingServer` lets it attach to an
 * already-running dev server on :3000 instead of rebuilding.
 */
/** Point the suite at an already-running build with BASE_URL=http://localhost:3005 */
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: BASE_URL,
    timeout: 300_000,
    reuseExistingServer: !process.env.CI,
  },
});
