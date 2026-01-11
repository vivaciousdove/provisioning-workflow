import { test, expect } from "@playwright/test";

test.describe("@api Provisioning API", () => {
  test("@api health endpoint is up", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;
    const res = await request.get(`${apiBase}/health`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBeTruthy();
  });

  test("@api create provisioning request", async ({ request }, testInfo) => {
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

  test("@api rejects missing required fields (422)", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    const res = await request.post(`${apiBase}/provision`, { data: {} });
    expect(res.status()).toBe(422);
  });

  test("@api rejects non-integer id in path (422)", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    const res = await request.get(`${apiBase}/provision/not-an-int`);
    expect(res.status()).toBe(422);
  });

  test("@api returns 404 for missing provisioning request", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    const res = await request.get(`${apiBase}/provision/99999999`);
    expect(res.status()).toBe(404);
  });

  test("@api rejects invalid list limit (400/422 depending on impl)", async ({ request }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    const res = await request.get(`${apiBase}/provision?limit=999`);
    // our API uses Query(ge/le) => 422, but some earlier versions used 400
    expect([400, 422]).toContain(res.status());
  });
});
