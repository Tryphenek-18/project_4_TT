const express = require("express");
const { query } = require("../db/pool");

const router = express.Router();

// GET /api/offers
router.get("/", async (req, res) => {
  try {
    const [rows] = await query("SELECT title, text, icon, color FROM offers ORDER BY id");
    res.json({ count: rows.length, offers: rows });
  } catch (err) {
    console.error("[api] GET /api/offers failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;