import { defineConfig, devices } from "@playwright/test";

const target = process.env.PLAYWRIGHT_TARGET;
const targets = ["next", "cloudflare"].filter((name) => !target || name === target);
if (!targets.length) throw new Error("PLAYWRIGHT_TARGET must be next or cloudflare");
const portFor = (name: string) => name === "next" ? 3100 : 8788;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    ...devices["Desktop Chrome"],
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: targets.map((name) => ({
    name,
    use: { baseURL: `http://127.0.0.1:${portFor(name)}` },
  })),
  webServer: targets.map((name) => ({
    name,
    command: name === "next"
      ? "npm run start -- --hostname 127.0.0.1 --port 3100"
      : "npm run start:vinext -- --ip 127.0.0.1 --port 8788 --local",
    url: `http://127.0.0.1:${portFor(name)}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
    },
  })),
});
