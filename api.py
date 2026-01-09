from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import mysql.connector
from mysql.connector import Error

# ---- DB CONFIG (keep simple for now; later we move to env vars) ----
DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "SQLroot123#",
    "database": "provisioning_lab",
}

app = FastAPI(title="Provisioning API", version="1.0")

# ---- CORS (required for browser / Playwright UI running on :5173) ----
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

# ---- Request/Response Models ----
class ProvisionCreate(BaseModel):
    customer_id: str = Field(..., max_length=32)
    service_type: str = Field(..., max_length=32)
    plan_code: str = Field(..., max_length=32)
    imei: str = Field(..., max_length=20)

class ProvisionOut(BaseModel):
    id: int
    customer_id: str
    service_type: str
    plan_code: str
    imei: str
    status: str
    created_at: str


def get_conn():
    return mysql.connector.connect(**DB_CONFIG)


@app.get("/health")
def health():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        cur.fetchone()
        cur.close()
        conn.close()
        return {"ok": True, "db": "up"}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"db_down: {e}")


@app.post("/provision", status_code=202)
def create_provision(req: ProvisionCreate):
    try:
        conn = get_conn()
        cur = conn.cursor()

        sql = """
        INSERT INTO provisioning_requests (customer_id, service_type, plan_code, imei, status)
        VALUES (%s, %s, %s, %s, 'RECEIVED');
        """
        cur.execute(sql, (req.customer_id, req.service_type, req.plan_code, req.imei))
        conn.commit()

        new_id = cur.lastrowid
        cur.close()
        conn.close()

        return {"id": new_id, "status": "RECEIVED"}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"db_error: {e}")


@app.get("/provision/{request_id}")
def get_provision(request_id: int):
    try:
        conn = get_conn()
        cur = conn.cursor(dictionary=True)

        cur.execute(
            "SELECT id, customer_id, service_type, plan_code, imei, status, created_at "
            "FROM provisioning_requests WHERE id = %s;",
            (request_id,),
        )
        row = cur.fetchone()

        cur.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="not_found")

        row["created_at"] = str(row["created_at"])
        return row
    except HTTPException:
        raise
    except Error as e:
        raise HTTPException(status_code=500, detail=f"db_error: {e}")


@app.get("/provision")
def list_provisions(limit: int = 20):
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=400, detail="limit must be 1..200")

    try:
        conn = get_conn()
        cur = conn.cursor(dictionary=True)

        cur.execute(
            "SELECT id, customer_id, service_type, plan_code, imei, status, created_at "
            "FROM provisioning_requests ORDER BY id DESC LIMIT %s;",
            (limit,),
        )
        rows = cur.fetchall()

        cur.close()
        conn.close()

        for r in rows:
            r["created_at"] = str(r["created_at"])
        return {"count": len(rows), "items": rows}
    except Error as e:
        raise HTTPException(status_code=500, detail=f"db_error: {e}")
