import os
import mysql.connector
from mysql.connector import Error


def get_conn():
    """
    Returns a mysql.connector connection using env vars (with local defaults).
    """
    cfg = {
        "host": os.getenv("DB_HOST", "127.0.0.1"),
        "port": int(os.getenv("DB_PORT", "3306")),
        "user": os.getenv("DB_USER", "root"),
        "password": os.getenv("DB_PASSWORD", "SQLroot123#"),
        "database": os.getenv("DB_NAME", "provisioning_lab"),
    }

    try:
        return mysql.connector.connect(**cfg)
    except Error as e:
        raise RuntimeError(f"DB connection failed: {e}")
