const express = require("express");
const { query } = require("../db/pool");

const router = express.Router();

// GET /api/shops
router.get("/", async (req, res) => {
  try {
    const [rows] = await query("SELECT name, tagline, icon, color FROM shops ORDER BY id");
    res.json({ count: rows.length, shops: rows });
  } catch (err) {
    console.error("[api] GET /api/shops failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;