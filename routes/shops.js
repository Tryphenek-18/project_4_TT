const express = require("express");
const { shops } = require("../data/db");

const router = express.Router();

// GET /api/shops
router.get("/", (req, res) => {
  res.json({ count: shops.length, shops });
});

module.exports = router;