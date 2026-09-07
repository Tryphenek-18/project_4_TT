const express = require("express");
const { query } = require("../db/pool");

const router = express.Router();

// GET /api/products?search=&category=&shop=&maxPrice=&minRating=
router.get("/", async (req, res) => {
  try {
    const { search, category, shop, maxPrice, minRating } = req.query;

    const where = [];
    const params = [];

    if (search) {
      const s = `%${String(search).trim()}%`;
      where.push("(p.name LIKE ? OR c.name LIKE ? OR s.name LIKE ?)");
      params.push(s, s, s);
    }
    if (category && category !== "all") {
      where.push("c.name = ?");
      params.push(category);
    }
    if (shop && shop !== "all") {
      where.push("s.name = ?");
      params.push(shop);
    }
    const max = parseFloat(maxPrice);
    if (!isNaN(max) && max > 0) {
      where.push("p.price <= ?");
      params.push(max);
    }
    const min = parseFloat(minRating);
    if (!isNaN(min) && min > 0) {
      where.push("p.rating >= ?");
      params.push(min);
    }

    const sql = `
      SELECT p.id, p.name, s.name AS shop, c.name AS category,
             p.price, p.rating, p.image, p.description, p.availability
      FROM products p
      JOIN shops s ON s.id = p.shop_id
      JOIN categories c ON c.id = p.category_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY p.id`;

    const [rows] = await query(sql, params);
    res.json({ count: rows.length, products: rows });
  } catch (err) {
    console.error("[api] GET /api/products failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows] = await query(
      `SELECT p.id, p.name, s.name AS shop, c.name AS category,
              p.price, p.rating, p.image, p.description, p.availability
       FROM products p
       JOIN shops s ON s.id = p.shop_id
       JOIN categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: `Product ${id} not found` });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("[api] GET /api/products/:id failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;