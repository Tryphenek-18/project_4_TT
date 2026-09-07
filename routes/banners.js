const express = require("express");
const { BANNERS, IMG } = require("../db/seed-data");

const router = express.Router();

router.get("/", (req, res) => {
  const banners = BANNERS.map(([id, title, subtitle]) => ({
    image: IMG(id, 1200, 500),
    title,
    subtitle
  }));
  res.json({ banners });
});

module.exports = router;
