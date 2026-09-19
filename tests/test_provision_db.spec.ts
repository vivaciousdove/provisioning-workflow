import { test, expect } from "@playwright/test";
import mysql from "mysql2/promise";

// Database settings use the same environment variables as GitHub Actions.
// Local defaults match the provisioning lab configuration.
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "SQLroot123#",
  database: process.env.DB_NAME || "provisioning_lab",
};

test.describe("@db Provisioning database", () => {
  test("@db provisioning request is persisted with expected values", async ({
    request,
  }, testInfo) => {
    const apiBase = testInfo.project.use.apiBaseURL as string;

    // Use a unique customer ID so repeated local and CI runs do not
    // depend on data created by an earlier test.
    const customerId = `CUST_DB_${Date.now()}`;

    const payload = {
      customer_id: customerId,
      service_type: "WIRELESS",
      plan_code: "PLAN_BASIC",
      imei: "356938035643810",
    };

    // Create the record through the application API first.
    const response = await request.post(`${apiBase}/provision`, {
      data: payload,
    });

    expect(response.status()).toBe(202);

    const body = await response.json();

    expect(body.id).toBeTruthy();
    expect(body.status).toBe("RECEIVED");

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Query MySQL directly using the ID returned by the API.
      const [rows] = await connection.execute(
        `
        SELECT customer_id, service_type, plan_code, imei, status
        FROM provisioning_requests
        WHERE id = ?
        `,
        [body.id],
      );

      const records = rows as Array<{
        customer_id: string;
        service_type: string;
        plan_code: string;
        imei: string;
        status: string;
      }>;

      expect(records).toHaveLength(1);

      const storedRecord = records[0];

      expect(storedRecord.customer_id).toBe(payload.customer_id);
      expect(storedRecord.service_type).toBe(payload.service_type);
      expect(storedRecord.plan_code).toBe(payload.plan_code);
      expect(storedRecord.imei).toBe(payload.imei);
      expect(storedRecord.status).toBe("RECEIVED");
    } finally {
      // Always release the DB connection, even when an assertion fails.
      await connection.end();
    }
  });
});