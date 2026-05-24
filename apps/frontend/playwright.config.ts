import { defineConfig, devices } from "@playwright/test";

const frontendUrl = "http://127.0.0.1:5173";
const backendUrl = "http://127.0.0.1:4010";
const browserChannel = process.env.CI ? undefined : "chrome";

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  reporter: process.env.CI ? "github" : "list",
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: frontendUrl,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "pnpm --filter @calls-calendar/backend start",
      cwd: "../..",
      reuseExistingServer: false,
      timeout: 120_000,
      url: `${backendUrl}/owner`,
    },
    {
      command: "pnpm --filter @calls-calendar/frontend dev -- --port 5173 --strictPort",
      cwd: "../..",
      reuseExistingServer: false,
      timeout: 120_000,
      url: frontendUrl,
    },
  ],
  workers: 1,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(browserChannel ? { channel: browserChannel } : {}),
      },
    },
  ],
});
