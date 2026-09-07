/* =========================================================
   SHOPME — MySQL connection pool
   Credentials: root with NO password (local dev).
   Override via env vars: DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
   ========================================================= */
const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "shopme";

let pool = null;

function initPool() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS !== undefined ? process.env.DB_PASS : "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true
  });
  return pool;
}

function query(sql, params) {
  if (!pool) throw new Error("Pool not initialised — call initPool() first");
  return pool.query(sql, params);
}

function getPool() {
  if (!pool) throw new Error("Pool not initialised — call initPool() first");
  return pool;
}

module.exports = { initPool, getPool, query, DB_NAME };
