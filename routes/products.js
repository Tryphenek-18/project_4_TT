const express = require("express");
const { products } = require("../data/db");

const router = express.Router();

// GET /api/products?search=&category=&shop=&maxPrice=&minRating=
router.get("/", (req, res) => {
  let result = products.slice();

  const { search, category, shop, maxPrice, minRating } = req.query;

  if (search) {
    const s = String(search).trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s) ||
      p.shop.toLowerCase().includes(s)
    );
  }
  if (category && category !== "all") {
    result = result.filter(p => p.category === category);
  }
  if (shop && shop !== "all") {
    result = result.filter(p => p.shop === shop);
  }
  const max = parseFloat(maxPrice);
  if (!isNaN(max) && max > 0) {
    result = result.filter(p => p.price <= max);
  }
  const min = parseFloat(minRating);
  if (!isNaN(min) && min > 0) {
    result = result.filter(p => p.rating >= min);
  }

  res.json({ count: result.length, products: result });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: `Product ${id} not found` });
  }
  res.json(product);
});

module.exports = router;