const express = require("express");
const { query } = require("../db/pool");

const router = express.Router();

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const [rows] = await query("SELECT name, icon, color FROM categories ORDER BY id");
    res.json({ count: rows.length, categories: rows });
  } catch (err) {
    console.error("[api] GET /api/categories failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;