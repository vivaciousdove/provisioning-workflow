// @ts-check
import { defineConfig } from "@playwright/test";
import path from "node:path";

const ROOT = __dirname;

// URLs
const WEB_BASE_URL = process.env.WEB_BASE_URL || "http://127.0.0.1:5173";
const API_BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:8000";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: WEB_BASE_URL,
    apiBaseURL: API_BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],

  // ✅ IMPORTANT:
  // Only auto-start servers when NOT in CI
  webServer: process.env.CI
    ? undefined
    : [
        {
          name: "api",
          command: "python -m uvicorn backend.api:app --host 127.0.0.1 --port 8000",
          url: `${API_BASE_URL}/health`,
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: "web",
          command: "python -m http.server 5173 --directory web --bind 127.0.0.1",
          url: WEB_BASE_URL,
          reuseExistingServer: true,
          timeout: 60_000,
        },
      ],

  projects: [
    { name: "ui", use: { browserName: "chromium" } },
    { name: "api" },
  ],
});
