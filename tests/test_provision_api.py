import re
from playwright.sync_api import Playwright

BASE_URL = "http://127.0.0.1:8000"

def test_health_ok(playwright: Playwright):
    request = playwright.request.new_context(base_url=BASE_URL)

    resp = request.get("/health")
    assert resp.status == 200

    data = resp.json()
    assert data["ok"] is True
    assert data["db"] == "up"

    request.dispose()


def test_provision_creates_request_and_persists(playwright: Playwright):
    request = playwright.request.new_context(base_url=BASE_URL)

    payload = {
        "customer_id": "CUST_PLAYWRIGHT_001",
        "service_type": "WIRELESS",
        "plan_code": "PLAN_BASIC",
        "imei": "356938035643810",
    }

    # POST /provision
    resp = request.post("/provision", data=payload)
    assert resp.status == 202

    created = resp.json()
    assert "id" in created
    assert created["status"] == "RECEIVED"

    request_id = created["id"]

    # GET /provision/{id}
    resp2 = request.get(f"/provision/{request_id}")
    assert resp2.status == 200

    row = resp2.json()
    assert row["customer_id"] == payload["customer_id"]
    assert row["service_type"] == payload["service_type"]
    assert row["plan_code"] == payload["plan_code"]
    assert row["imei"] == payload["imei"]
    assert row["status"] == "RECEIVED"
    assert isinstance(row["created_at"], str)
    assert re.search(r"\d{4}-\d{2}-\d{2}", row["created_at"])

    request.dispose()
