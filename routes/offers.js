const express = require("express");
const { offers } = require("../data/db");

const router = express.Router();

// GET /api/offers
router.get("/", (req, res) => {
  res.json({ count: offers.length, offers });
});

module.exports = router;