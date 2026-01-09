import { test, expect } from "@playwright/test";

test.describe("Provisioning API", () => {
  test("health endpoint is up", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;
    const res = await request.get(`${apiBase}/health`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBeTruthy();
  });

  test("create provisioning request", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    const payload = {
      customer_id: "CUST_PLAYWRIGHT_001",
      service_type: "WIRELESS",
      plan_code: "PLAN_BASIC",
      imei: "356938035643810",
    };

    const res = await request.post(`${apiBase}/provision`, { data: payload });
    expect(res.status()).toBe(202);

    const body = await res.json();
    expect(body.id).toBeTruthy();
    expect(body.status).toBe("RECEIVED");
  });
});
