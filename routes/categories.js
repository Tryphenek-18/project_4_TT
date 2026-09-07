const express = require("express");
const { categories } = require("../data/db");

const router = express.Router();

// GET /api/categories
router.get("/", (req, res) => {
  res.json({ count: categories.length, categories });
});

module.exports = router;