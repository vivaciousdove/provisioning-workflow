import { test, expect } from "@playwright/test";

test("UI form submits provisioning request and shows success", async ({ page }) => {
  // uses config baseURL
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: /provisioning lab/i })).toBeVisible();

  // Fill the form (match your index.html ids)
  await page.locator("#customer_id").fill("CUST_UI_PW_001");
  await page.locator("#service_type").selectOption("WIRELESS");
  await page.locator("#plan_code").fill("PLAN_BASIC");
  await page.locator("#imei").fill("356938035643810");

  // Click submit and confirm success text appears
  await page.getByRole("button", { name: /submit provision request/i }).click();

  // Update this matcher if your UI uses different success text
  await expect(page.locator("#result")).toContainText(/success|received|id/i);
});
