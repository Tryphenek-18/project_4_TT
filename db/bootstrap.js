/* =========================================================
   SHOPME — DB bootstrap
   Creates database, tables and seed data if missing.
   Called automatically by server.js at startup.
   ========================================================= */
const mysql = require("mysql2/promise");
const { DB_NAME, CATEGORIES, SHOPS, OFFERS, PRODUCTS, IMG } = require("./seed-data");

const CFG = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS !== undefined ? process.env.DB_PASS : ""
};

async function bootstrap() {
  const conn = await mysql.createConnection({ ...CFG, multipleStatements: true });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.query(`USE \`${DB_NAME}\``);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(80) NOT NULL UNIQUE,
      icon VARCHAR(60) NOT NULL,
      color VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS shops (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(80) NOT NULL UNIQUE,
      tagline VARCHAR(160) NOT NULL,
      icon VARCHAR(60) NOT NULL,
      color VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS offers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      text VARCHAR(200) NOT NULL,
      icon VARCHAR(60) NOT NULL,
      color VARCHAR(20) NOT NULL
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(160) NOT NULL,
      shop_id INT NOT NULL,
      category_id INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      rating DECIMAL(2,1) NOT NULL,
      image VARCHAR(300) NOT NULL,
      description TEXT NOT NULL,
      availability ENUM('In Stock','Low Stock','Out of Stock') NOT NULL DEFAULT 'In Stock',
      CONSTRAINT fk_products_shop FOREIGN KEY (shop_id) REFERENCES shops(id),
      CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
      INDEX idx_products_category (category_id),
      INDEX idx_products_shop (shop_id)
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(200) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      customer_name VARCHAR(120) NOT NULL DEFAULT '',
      customer_email VARCHAR(200) NOT NULL DEFAULT '',
      subtotal DECIMAL(10,2) NOT NULL,
      shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB;

    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      name VARCHAR(160) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      qty INT NOT NULL,
      line_total DECIMAL(10,2) NOT NULL,
      CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
    ) ENGINE=InnoDB;
  `);

  const [[{ c: catCount }]] = await conn.query("SELECT COUNT(*) AS c FROM categories");
  if (catCount === 0) {
    await conn.query("INSERT INTO categories (name, icon, color) VALUES ?", [CATEGORIES]);
  }

  const [[{ c: shopCount }]] = await conn.query("SELECT COUNT(*) AS c FROM shops");
  if (shopCount === 0) {
    await conn.query("INSERT INTO shops (name, tagline, icon, color) VALUES ?", [SHOPS]);
  }

  const [[{ c: offerCount }]] = await conn.query("SELECT COUNT(*) AS c FROM offers");
  if (offerCount === 0) {
    await conn.query("INSERT INTO offers (title, text, icon, color) VALUES ?", [OFFERS]);
  }

  const [[{ c: prodCount }]] = await conn.query("SELECT COUNT(*) AS c FROM products");
  if (prodCount === 0) {
    const [[shops], [cats]] = await Promise.all([
      conn.query("SELECT id, name FROM shops"),
      conn.query("SELECT id, name FROM categories")
    ]);
    const shopId = Object.fromEntries(shops.map(s => [s.name, s.id]));
    const catId = Object.fromEntries(cats.map(c => [c.name, c.id]));

    const rows = PRODUCTS.map(([name, shop, cat, price, rating, imgId, desc, avail]) => [
      name, shopId[shop], catId[cat], price, rating, IMG(imgId), desc, avail
    ]);
    await conn.query(
      "INSERT INTO products (name, shop_id, category_id, price, rating, image, description, availability) VALUES ?",
      [rows]
    );
  }

  await conn.end();

  const { initPool, query } = require("./pool");
  initPool();
  const [[p]] = await query("SELECT COUNT(*) AS c FROM products");
  console.log(`[db] ready — database "${DB_NAME}" with ${p.c} products`);
}

module.exports = { bootstrap };
