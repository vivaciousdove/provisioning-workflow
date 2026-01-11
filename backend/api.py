from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from backend.db_connect import get_conn

app = FastAPI(title="Provisioning Lab API", version="1.0")

# Local UI runs on 5173, allow it (CI might use 127.0.0.1 too)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProvisionRequest(BaseModel):
    customer_id: str = Field(..., min_length=1, max_length=32)
    service_type: str = Field(..., min_length=1, max_length=32)
    plan_code: str = Field(..., min_length=1, max_length=32)
    imei: str = Field(..., min_length=1, max_length=20)

    @field_validator("imei")
    @classmethod
    def imei_must_be_exactly_15_digits(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit():
            raise ValueError("imei must be numeric")
        if len(v) != 15:
            raise ValueError("imei must be exactly 15 digits")
        return v


@app.get("/health")
def health():
    # verify DB connectivity too
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.fetchone()
        cur.close()
        conn.close()
        return {"ok": True, "db": "up"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_down: {e}")


@app.post("/provision", status_code=202)
def create_provision(req: ProvisionRequest):
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO provisioning_requests
              (customer_id, service_type, plan_code, imei, status)
            VALUES
              (%s, %s, %s, %s, 'RECEIVED');
            """,
            (req.customer_id, req.service_type, req.plan_code, req.imei),
        )
        conn.commit()
        new_id = cur.lastrowid
        cur.close()

        return {"id": new_id, "status": "RECEIVED"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"db_error: {e}")
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.get("/provision/{provision_id}")
def get_provision(provision_id: int):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT id, customer_id, service_type, plan_code, imei, status, created_at
            FROM provisioning_requests
            WHERE id = %s;
            """,
            (provision_id,),
        )
        row = cur.fetchone()
        cur.close()

        if not row:
            raise HTTPException(status_code=404, detail="not_found")

        row["created_at"] = str(row["created_at"])
        return row
    finally:
        try:
            conn.close()
        except Exception:
            pass


@app.get("/provision")
def list_provision(limit: int = Query(20, ge=1, le=200)):
    conn = get_conn()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(
            """
            SELECT id, customer_id, service_type, plan_code, imei, status, created_at
            FROM provisioning_requests
            ORDER BY id DESC
            LIMIT %s;
            """,
            (limit,),
        )
        rows = cur.fetchall()
        cur.close()

        for r in rows:
            r["created_at"] = str(r["created_at"])
        return {"count": len(rows), "items": rows}
    finally:
        try:
            conn.close()
        except Exception:
            pass
