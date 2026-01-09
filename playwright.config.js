// @ts-check
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,

  use: {
    // UI base URL (page.goto("/"))
    baseURL: process.env.WEB_BASE_URL || "http://127.0.0.1:5173",

    // API base URL (request.get("/health") needs a host)
    apiBaseURL: process.env.API_BASE_URL || "http://127.0.0.1:8000",

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],

  webServer: [
    {
      name: "api",
      command:
        ".\\.venv\\Scripts\\python.exe -m uvicorn api:app --host 127.0.0.1 --port 8000",
      url: "http://127.0.0.1:8000/health",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      name: "web",
      command: "python -m http.server 5173 -d web",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],

  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
