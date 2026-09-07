/* =========================================================
   ShopVerse — Express server
   Serves the static frontend + a small REST API backed by MySQL
   ========================================================= */
const path = require("path");
const express = require("express");
const cors = require("cors");

const productsRouter = require("./routes/products");
const shopsRouter = require("./routes/shops");
const categoriesRouter = require("./routes/categories");
const offersRouter = require("./routes/offers");
const ordersRouter = require("./routes/orders");
const { bootstrap } = require("./db/bootstrap");

const app = express();
const PORT = process.env.PORT || 3000;

/* ---- Middleware ---- */
app.use(cors());
app.use(express.json());

/* ---- Static frontend (index.html, css/, js/) ---- */
app.use(express.static(path.join(__dirname, "public")));

/* ---- REST API ---- */
app.use("/api/products", productsRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/offers", offersRouter);
app.use("/api/orders", ordersRouter);

/* ---- Health check ---- */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "ShopVerse API", time: new Date().toISOString() });
});

/* ---- 404 handler for unknown API routes ---- */
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

/* ---- Serve index.html for any non-API path (SPA fallback) ---- */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ---- Boot: bootstrap MySQL, then listen ---- */
(async () => {
  try {
    await bootstrap();
    app.listen(PORT, () => {
      console.log(`ShopVerse server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("\n[db] FATAL: could not initialise MySQL:", err.message);
    console.error("[db] Hints:");
    console.error("  - Is MySQL running?            sudo service mysql status");
    console.error("  - root must allow passwordless access:");
    console.error("      sudo mysql -e \"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;\"");
    console.error("  - Or use a dedicated user via env vars: DB_USER, DB_PASS, DB_HOST, DB_NAME\n");
    process.exit(1);
  }
})();