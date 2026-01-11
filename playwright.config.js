// @ts-check
import { defineConfig } from "@playwright/test";
import path from "node:path";

const ROOT = __dirname;

// Use venv python on Windows; fall back to "python" for CI/Linux/macOS
const VENV_PY_WIN = path.join(ROOT, ".venv", "Scripts", "python.exe");
const PY = process.platform === "win32" ? VENV_PY_WIN : "python";

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

  webServer: [
    {
      name: "api",
      command: `${PY} -m uvicorn backend.api:app --host 127.0.0.1 --port 8000`,
      url: `${API_BASE_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        ...process.env,
        DB_HOST: process.env.DB_HOST || "127.0.0.1",
        DB_PORT: process.env.DB_PORT || "3306",
        DB_USER: process.env.DB_USER || "root",
        DB_PASSWORD: process.env.DB_PASSWORD || "SQLroot123#",
        DB_NAME: process.env.DB_NAME || "provisioning_lab",
      },
    },
    {
      name: "web",
      command: `${PY} -m http.server 5173 -d web`,
      url: WEB_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],

  projects: [
    { name: "ui", use: { browserName: "chromium" } },
    { name: "api" },
  ],
});
