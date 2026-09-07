const express = require("express");
const { products, orders } = require("../data/db");

const router = express.Router();

// POST /api/orders
// Body: { items: [{ id, qty }], customer: { name, email } }
router.post("/", (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer || {};

  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  // Validate each line and compute totals using the canonical price from the data store.
  const lineItems = [];
  let subtotal = 0;
  for (const raw of items) {
    const id = parseInt(raw.id, 10);
    const qty = parseInt(raw.qty, 10);
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: `Product ${id} not found` });
    }
    if (!qty || qty < 1) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}` });
    }
    if (product.availability === "Out of Stock") {
      return res.status(400).json({ error: `${product.name} is out of stock` });
    }
    const lineTotal = Math.round(product.price * qty * 100) / 100;
    subtotal += lineTotal;
    lineItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
      lineTotal
    });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const shipping = 0; // free shipping in this demo
  const total = Math.round((subtotal + shipping) * 100) / 100;

  // Persist the order in memory
  const id = 1000 + orders.length;
  const order = {
    id,
    items: lineItems,
    customer: {
      name: String(customer.name || "").slice(0, 120),
      email: String(customer.email || "").slice(0, 200)
    },
    subtotal,
    shipping,
    total,
    createdAt: new Date().toISOString()
  };
  orders.push(order);

  res.status(201).json({ message: "Order placed successfully", order });
});

// GET /api/orders — list all placed orders (useful for demonstration/debugging)
router.get("/", (req, res) => {
  res.json({ count: orders.length, orders });
});

module.exports = router;