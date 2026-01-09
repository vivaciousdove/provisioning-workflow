import mysql.connector

def main():
    conn = mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="SQLroot123#",
        database="provisioning_lab",
    )

    cur = conn.cursor()

    # Verify connection
    cur.execute("SELECT VERSION();")
    print("MySQL version:", cur.fetchone()[0])

    # Show tables
    cur.execute("SHOW TABLES;")
    print("Tables:", [r[0] for r in cur.fetchall()])

    # Insert a provisioning request
    insert_sql = """
    INSERT INTO provisioning_requests
        (customer_id, service_type, plan_code, imei, status)
    VALUES (%s, %s, %s, %s, %s)
    """
    data = (
        "CUST-1001",
        "WIRELESS",
        "PLAN-BASIC",
        "356789012345678",
        "RECEIVED",
    )
    cur.execute(insert_sql, data)
    conn.commit()
    print("Inserted row ID:", cur.lastrowid)

    # Read back latest records
    cur.execute("""
        SELECT id, customer_id, service_type, plan_code, imei, status, created_at
        FROM provisioning_requests
        ORDER BY id DESC
        LIMIT 5
    """)
    for row in cur.fetchall():
        print(row)

    cur.close()
    conn.close()
    print("✅ DB connection successful")

if __name__ == "__main__":
    main()
