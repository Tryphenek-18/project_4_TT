const express = require("express");
const bcrypt = require("bcryptjs");
const { query } = require("../db/pool");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // Check if email already exists
    const [existing] = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), passwordHash]
    );

    const user = { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase() };
    req.session.user = user;
    res.status(201).json({ message: "Account created successfully.", user });
  } catch (err) {
    console.error("[api] POST /api/auth/register failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const [rows] = await query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const safeUser = { id: user.id, name: user.name, email: user.email };
    req.session.user = safeUser;
    res.json({ message: "Logged in successfully.", user: safeUser });
  } catch (err) {
    console.error("[api] POST /api/auth/login failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("[api] POST /api/auth/logout failed:", err.message);
      return res.status(500).json({ error: "Could not log out." });
    }
    res.clearCookie("shopme.sid");
    res.json({ message: "Logged out successfully." });
  });
});

// GET /api/auth/me — return the logged-in user (or null)
router.get("/me", (req, res) => {
  res.json({ user: req.session.user || null });
});

module.exports = router;