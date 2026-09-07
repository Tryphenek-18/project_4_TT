/* =========================================================
   ShopVerse — Data Layer
   All product/shop/category/offer data + in-memory orders
   ========================================================= */

const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    shop: "TechGadget",
    category: "Electronics",
    price: 129.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and a comfortable fit for all-day listening.",
    availability: "In Stock"
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    shop: "TechGadget",
    category: "Electronics",
    price: 249.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Track your workouts, heart rate, and sleep with this sleek smart watch. Water resistant with a bright AMOLED display.",
    availability: "In Stock"
  },
  {
    id: 3,
    name: "Bluetooth Portable Speaker",
    shop: "SoundHub",
    category: "Electronics",
    price: 59.99,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Compact waterproof speaker with powerful 360° sound and 12 hours of playtime. Perfect for the beach or home.",
    availability: "In Stock"
  },
  {
    id: 4,
    name: "Classic Denim Jacket",
    shop: "Fashionista",
    category: "Fashion",
    price: 89.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Timeless denim jacket made from soft, durable cotton. A wardrobe essential that pairs with anything.",
    availability: "In Stock"
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    shop: "Fashionista",
    category: "Fashion",
    price: 119.0,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Elegant genuine leather crossbody bag with multiple compartments and an adjustable strap.",
    availability: "Low Stock"
  },
  {
    id: 6,
    name: "Running Shoes Pro",
    shop: "SportWorld",
    category: "Sports",
    price: 139.5,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh. Ideal for daily runs.",
    availability: "In Stock"
  },
  {
    id: 7,
    name: "Yoga Mat Premium",
    shop: "SportWorld",
    category: "Sports",
    price: 34.99,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Extra-thick, non-slip yoga mat with alignment lines. Comes with a carrying strap.",
    availability: "In Stock"
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug Set",
    shop: "HomeNest",
    category: "Home & Living",
    price: 24.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Set of 4 beautifully glazed ceramic mugs, microwave and dishwasher safe.",
    availability: "In Stock"
  },
  {
    id: 9,
    name: "LED Desk Lamp",
    shop: "HomeNest",
    category: "Home & Living",
    price: 45.0,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Adjustable LED desk lamp with 5 brightness levels and a USB charging port.",
    availability: "Out of Stock"
  },
  {
    id: 10,
    name: "Bestselling Novel Collection",
    shop: "BookWorm",
    category: "Books",
    price: 39.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "A curated box set of three bestselling novels. Perfect for any book lover.",
    availability: "In Stock"
  },
  {
    id: 11,
    name: "Cookbook: Fast & Healthy",
    shop: "BookWorm",
    category: "Books",
    price: 18.5,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Over 100 quick and nutritious recipes with beautiful photography and simple steps.",
    availability: "Low Stock"
  },
  {
    id: 12,
    name: "Wireless Charging Pad",
    shop: "TechGadget",
    category: "Electronics",
    price: 29.99,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    availability: "In Stock"
  }
];

// Generate unique photo URLs deterministically (like the original frontend did)
const PRODUCT_IMG = (i) => `https://images.unsplash.com/photo-1441984912348?w=500&h=400&fit=crop&sig=${i}`;
products.forEach((p, idx) => { p.unique_photo = PRODUCT_IMG(idx + 1); });

const shops = [
  { name: "TechGadget", tagline: "Latest electronics & gadgets", icon: "bi-laptop", color: "#6f42c1" },
  { name: "Fashionista", tagline: "Trendy fashion & accessories", icon: "bi-bag-heart", color: "#d63384" },
  { name: "SportWorld", tagline: "Gear up for every sport", icon: "bi-bicycle", color: "#198754" },
  { name: "HomeNest", tagline: "Cozy home & living essentials", icon: "bi-house-heart", color: "#fd7e14" },
  { name: "SoundHub", tagline: "Audio that moves you", icon: "bi-music-note-beamed", color: "#0d6efd" },
  { name: "BookWorm", tagline: "Stories worth reading", icon: "bi-book", color: "#dc3545" }
];

const categories = [
  { name: "Electronics", icon: "bi-phone", color: "#0d6efd" },
  { name: "Fashion", icon: "bi-bag-heart", color: "#d63384" },
  { name: "Home & Living", icon: "bi-house-heart", color: "#fd7e14" },
  { name: "Sports", icon: "bi-person-bounding-box", color: "#198754" },
  { name: "Books", icon: "bi-book", color: "#dc3545" }
];

const offers = [
  { title: "Summer Mega Sale", text: "Up to 50% OFF on all electronics", icon: "bi-lightning-charge", color: "#dc3545" },
  { title: "Free Shipping", text: "On all orders over $100", icon: "bi-truck", color: "#198754" },
  { title: "New User Deal", text: "Get 10% off your first purchase", icon: "bi-gift", color: "#6f42c1" },
  { title: "Flash Discounts", text: "Daily deals updated every hour", icon: "bi-stopwatch", color: "#fd7e14" }
];

// In-memory store for submitted orders (resets when the server restarts).
const orders = [];

module.exports = { products, shops, categories, offers, orders };