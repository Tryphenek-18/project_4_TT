const express = require("express");
const { getPool } = require("../db/pool");

const router = express.Router();

// POST /api/orders
// Body: { items: [{ id, qty }], customer: { name, email } }
router.post("/", async (req, res) => {
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const customer = body.customer || {};

  if (items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();

    const lineItems = [];
    let subtotal = 0;

    for (const raw of items) {
      const id = parseInt(raw.id, 10);
      const qty = parseInt(raw.qty, 10);

      const [rows] = await conn.query("SELECT * FROM products WHERE id = ? FOR UPDATE", [id]);
      if (rows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: `Product ${id} not found` });
      }
      const product = rows[0];

      if (!qty || qty < 1) {
        await conn.rollback();
        return res.status(400).json({ error: `Invalid quantity for ${product.name}` });
      }
      if (product.availability === "Out of Stock") {
        await conn.rollback();
        return res.status(400).json({ error: `${product.name} is out of stock` });
      }

      const price = parseFloat(product.price);
      const lineTotal = Math.round(price * qty * 100) / 100;
      subtotal += lineTotal;
      lineItems.push({ id: product.id, name: product.name, price, qty, lineTotal });
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const shipping = 0;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const userId = req.session.user ? req.session.user.id : null;
    const customerName = (customer.name || (req.session.user ? req.session.user.name : "")).slice(0, 120);
    const customerEmail = (customer.email || (req.session.user ? req.session.user.email : "")).slice(0, 200);

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, customer_name, customer_email, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, customerName, customerEmail, subtotal, shipping, total]
    );

    const orderId = orderResult.insertId;
    const itemRows = lineItems.map(li => [orderId, li.id, li.name, li.price, li.qty, li.lineTotal]);
    await conn.query(
      "INSERT INTO order_items (order_id, product_id, name, price, qty, line_total) VALUES ?",
      [itemRows]
    );

    await conn.commit();

    res.status(201).json({
      message: "Order placed successfully",
      order: {
        id: orderId,
        items: lineItems,
        customer: { name: customerName, email: customerEmail },
        subtotal,
        shipping,
        total,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error("[api] POST /api/orders failed:", err.message);
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
});

// GET /api/orders — list placed orders with their items
router.get("/", async (req, res) => {
  try {
    const [orders] = await getPool().query("SELECT * FROM orders ORDER BY id DESC");
    const [items] = await getPool().query("SELECT * FROM order_items");
    const byOrder = {};
    for (const it of items) {
      (byOrder[it.order_id] = byOrder[it.order_id] || []).push({
        id: it.product_id,
        name: it.name,
        price: parseFloat(it.price),
        qty: it.qty,
        lineTotal: parseFloat(it.line_total)
      });
    }
    const result = orders.map(o => ({
      id: o.id,
      userId: o.user_id,
      items: byOrder[o.id] || [],
      customer: { name: o.customer_name, email: o.customer_email },
      subtotal: parseFloat(o.subtotal),
      shipping: parseFloat(o.shipping),
      total: parseFloat(o.total),
      createdAt: o.created_at
    }));
    res.json({ count: result.length, orders: result });
  } catch (err) {
    console.error("[api] GET /api/orders failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
