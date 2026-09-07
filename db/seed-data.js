/* =========================================================
   SHOPME — DB seed data
   ========================================================= */
const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "shopme";

const IMG = (id, w = 640, h = 480) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

const CATEGORIES = [
  ["Electronics", "bi-phone", "#7c3aed"],
  ["Fashion", "bi-bag-heart", "#e11d48"],
  ["Home & Living", "bi-house-heart", "#f59e0b"],
  ["Sports", "bi-person-bounding-box", "#059669"],
  ["Books", "bi-book", "#dc2626"]
];

const SHOPS = [
  ["TechGadget", "Latest electronics & gadgets", "bi-laptop", "#7c3aed"],
  ["Fashionista", "Trendy fashion & accessories", "bi-bag-heart", "#e11d48"],
  ["SportWorld", "Gear up for every sport", "bi-bicycle", "#059669"],
  ["HomeNest", "Cozy home & living essentials", "bi-house-heart", "#f59e0b"],
  ["SoundHub", "Audio that moves you", "bi-music-note-beamed", "#2563eb"],
  ["BookWorm", "Stories worth reading", "bi-book", "#dc2626"]
];

const OFFERS = [
  ["Summer Mega Sale", "Up to 50% OFF on all electronics", "bi-lightning-charge", "#e11d48"],
  ["Free Shipping", "On all orders over $100", "bi-truck", "#059669"],
  ["New User Deal", "Get 10% off your first purchase", "bi-gift", "#7c3aed"],
  ["Flash Discounts", "Daily deals updated every hour", "bi-stopwatch", "#f59e0b"]
];

const PRODUCTS = [
  ["Wireless Noise-Cancelling Headphones", "TechGadget", "Electronics", 129.99, 4.6, "1505740420928-5e560c06d30e", "Premium over-ear headphones with active noise cancellation, 30-hour battery life and a comfortable fit.", "In Stock"],
  ["Smart Watch Series 5", "TechGadget", "Electronics", 249.99, 4.8, "1523275335684-37898b6baf30", "Track workouts, heart rate and sleep. Water resistant with a bright AMOLED display.", "In Stock"],
  ["Bluetooth Portable Speaker", "SoundHub", "Electronics", 59.99, 4.2, "1608043152269-423dbba4e7e1", "Compact waterproof speaker with powerful 360 sound and 12 hours of playtime.", "In Stock"],
  ["4K Action Camera", "TechGadget", "Electronics", 189.0, 4.5, "1526170375885-4d8ecf77b99f", "Capture adventures in crisp 4K with image stabilization and waterproof casing.", "In Stock"],
  ["Gaming Mouse RGB", "TechGadget", "Electronics", 49.99, 4.3, "1527814050087-3793815479db", "Ergonomic gaming mouse with 16,000 DPI sensor and customizable RGB lighting.", "In Stock"],
  ["Classic Denim Jacket", "Fashionista", "Fashion", 89.99, 4.4, "1521572163474-6864f9cf17ab", "Timeless denim jacket made from soft, durable cotton. A wardrobe essential.", "In Stock"],
  ["Leather Crossbody Bag", "Fashionista", "Fashion", 119.0, 4.7, "1548036328-c9fa89d128fa", "Elegant genuine leather bag with multiple compartments and adjustable strap.", "Low Stock"],
  ["Sunglasses Aviator", "Fashionista", "Fashion", 79.99, 4.1, "1511499767150-a48a237f0083", "Classic aviator sunglasses with UV400 protection and lightweight metal frame.", "In Stock"],
  ["Running Shoes Pro", "SportWorld", "Sports", 139.5, 4.5, "1542291026-7eec264c27ff", "Lightweight running shoes with responsive cushioning and breathable mesh.", "In Stock"],
  ["Yoga Mat Premium", "SportWorld", "Sports", 34.99, 4.1, "1571019613454-1cb2f99b2d8b", "Extra-thick, non-slip yoga mat with alignment lines. Carrying strap included.", "In Stock"],
  ["Dumbbell Set 20kg", "SportWorld", "Sports", 99.0, 4.4, "1517836357463-d25dfeac3438", "Adjustable dumbbell set with anti-slip grips for a complete home workout.", "In Stock"],
  ["Basketball Official Size", "SportWorld", "Sports", 45.0, 4.2, "1546519638-68e109498ffc", "Official size 7 basketball with premium composite leather for indoor/outdoor play.", "Low Stock"],
  ["Ceramic Coffee Mug Set", "HomeNest", "Home & Living", 24.99, 4.3, "1514228742587-6b1558fcca3d", "Set of 4 beautifully glazed ceramic mugs, microwave and dishwasher safe.", "In Stock"],
  ["LED Desk Lamp", "HomeNest", "Home & Living", 45.0, 4.0, "1507473885765-e6ed057f782c", "Adjustable LED lamp with 5 brightness levels and a USB charging port.", "Out of Stock"],
  ["Scented Candle Trio", "HomeNest", "Home & Living", 29.99, 4.6, "1481833761820-0509d3217039", "Hand-poured soy candles in vanilla, lavender and sandalwood. 40h burn time.", "In Stock"],
  ["Throw Blanket Soft", "HomeNest", "Home & Living", 39.99, 4.5, "1592432678016-e910b452f9a2", "Ultra-soft woven throw blanket, perfect for couch evenings. Machine washable.", "In Stock"],
  ["Bestselling Novel Collection", "BookWorm", "Books", 39.99, 4.9, "1512820790803-83ca734da794", "A curated box set of three bestselling novels. Perfect for any book lover.", "In Stock"],
  ["Cookbook: Fast & Healthy", "BookWorm", "Books", 18.5, 4.2, "1490645935967-10de6ba17061", "Over 100 quick and nutritious recipes with beautiful photography.", "Low Stock"],
  ["Leather Journal Notebook", "BookWorm", "Books", 22.99, 4.4, "1544716278-ca5e3f4abd8c", "Handcrafted leather journal with 240 dotted pages and a pen holder.", "In Stock"],
  ["World Atlas Illustrated", "BookWorm", "Books", 34.5, 4.7, "1524995997946-a1c2e315a42f", "Beautifully illustrated atlas with detailed maps and geography insights.", "In Stock"]
];

const BANNERS = [
  ["1441986300917-64674bd600d8", "Welcome to SHOPME", "Your one-stop destination for the best deals and newest arrivals."],
  ["1483985988355-763728e1935b", "New Arrivals", "Discover the trendiest products just added to our catalogue."],
  ["1472851294608-062f824d29cc", "Special Offers", "Up to 50% off on selected items. Limited time only!"]
];

module.exports = { DB_NAME, CATEGORIES, SHOPS, OFFERS, PRODUCTS, IMG, BANNERS };
