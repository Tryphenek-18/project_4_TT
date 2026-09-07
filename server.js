/* =========================================================
   SHOPME — Express server
   Serves the static frontend + a REST API backed by MySQL
   ========================================================= */
const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const productsRouter = require("./routes/products");
const shopsRouter = require("./routes/shops");
const categoriesRouter = require("./routes/categories");
const offersRouter = require("./routes/offers");
const ordersRouter = require("./routes/orders");
const authRouter = require("./routes/auth");
const { bootstrap } = require("./db/bootstrap");
const { BANNERS, IMG } = require("./db/seed-data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(session({
  name: "shopme.sid",
  secret: process.env.SESSION_SECRET || "shopme-dev-secret-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/shops", shopsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/offers", offersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);

app.get("/api/banners", (req, res) => {
  const banners = BANNERS.map(([id, title, text]) => ({
    image: IMG(id, 1200, 500),
    title,
    text
  }));
  res.json({ banners });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SHOPME API", time: new Date().toISOString() });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

(async () => {
  try {
    await bootstrap();
    app.listen(PORT, () => {
      console.log(`SHOPME server running at http://localhost:${PORT}`);
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
