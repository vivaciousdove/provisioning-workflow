import { test, expect } from "@playwright/test";

test("@ui UI form submits provisioning request and shows success", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /provisioning lab/i })).toBeVisible();

  await page.getByTestId("customer_id").fill("CUST_UI_001");
  await page.getByTestId("service_type").selectOption("WIRELESS"); // select needs selectOption
  await page.getByTestId("plan_code").fill("PLAN_BASIC");
  await page.getByTestId("imei").fill("356938035643810");

  await page.getByTestId("submitBtn").click();

  await expect(page.getByTestId("status")).toContainText(/Accepted:\s*202/i);
  await expect(page.getByTestId("result")).toContainText(/"id":\s*\d+/i);
});

test("@ui required-field validation blocks empty submit", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByTestId("customer_id").fill("");
  await page.getByTestId("plan_code").fill("");
  await page.getByTestId("imei").fill("");

  // click submit; HTML required fields should prevent submit
  await page.getByTestId("submitBtn").click();

  // Browser validity check: required input should show missing
  const missingCustomer = await page.getByTestId("customer_id").evaluate((el) => {
    const input = el as HTMLInputElement;
    return input.validity.valueMissing;
  });
  expect(missingCustomer).toBeTruthy();
});

test("@ui invalid IMEI length shows error", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByTestId("customer_id").fill("CUST_UI_BAD_IMEI");
  await page.getByTestId("service_type").selectOption("WIRELESS");
  await page.getByTestId("plan_code").fill("PLAN_BASIC");
  await page.getByTestId("imei").fill("123"); // invalid length => API should return 422

  await page.getByTestId("submitBtn").click();

  await expect(page.getByTestId("status")).toContainText(/Error:\s*422/i);
  await expect(page.getByTestId("result")).toContainText(/imei/i);
});
