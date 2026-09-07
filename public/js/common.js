/* =========================================================
   SHOPME - Shared frontend logic (navbar, footer, auth, cart)
   Loaded by every page.
   ========================================================= */
const API = {
  products: '/api/products',
  shops: '/api/shops',
  categories: '/api/categories',
  offers: '/api/offers',
  orders: '/api/orders',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout'
  }
};

const currency = (n) => '$' + n.toFixed(2);

function saveCart() { localStorage.setItem('sm_cart', JSON.stringify(cart)); }
function saveFavs() { localStorage.setItem('sm_favs', JSON.stringify(favorites)); }
function loadCart() {
  try { cart = JSON.parse(localStorage.getItem('sm_cart')) || []; }
  catch (e) { cart = []; }
}
function loadFavs() {
  try { favorites = JSON.parse(localStorage.getItem('sm_favs')) || []; }
  catch (e) { favorites = []; }
}

let cart = [];
let favorites = [];
let currentUser = null;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('GET ' + url + ' failed: ' + res.status);
  return res.json();
}
const NAVBAR_HTML = `
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm" id="mainNavbar">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.html">
        <i class="bi bi-bag-heart-fill me-1"></i>SHOPME
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="products.html">Products</a></li>
          <li class="nav-item"><a class="nav-link" href="shops.html">Shops</a></li>
          <li class="nav-item"><a class="nav-link" href="categories.html">Categories</a></li>
          <li class="nav-item"><a class="nav-link" href="offers.html">Offers</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
        </ul>
        <form class="d-flex" role="search" onsubmit="return searchSubmit(event);">
          <input class="form-control me-2 search-input" type="search" id="navbarSearch" placeholder="Search products..." aria-label="Search">
        </form>
        <a class="btn btn-outline-light position-relative ms-2" href="cart.html">
          <i class="bi bi-cart3"></i> Cart
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger" id="cartCountNav">0</span>
        </a>
        <a class="btn btn-outline-light position-relative ms-1" href="favorites.html">
          <i class="bi bi-heart-fill"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger" id="favCountNav">0</span>
        </a>
        <div class="ms-2" id="authButtons">
          <a href="login.html" class="btn btn-light btn-sm">Login</a>
        </div>
      </div>
    </div>
  </nav>
`;

const FOOTER_HTML = `
  <footer class="footer text-white pt-5 pb-3 mt-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-4">
          <h5 class="fw-bold"><i class="bi bi-bag-heart-fill me-1"></i>SHOPME</h5>
          <p class="text-white-50 small">Your one-stop destination for the best deals and newest arrivals.</p>
        </div>
        <div class="col-md-2">
          <h6 class="fw-bold">Quick Links</h6>
          <ul class="list-unstyled small">
            <li><a href="products.html" class="footer-link">Products</a></li>
            <li><a href="shops.html" class="footer-link">Shops</a></li>
            <li><a href="categories.html" class="footer-link">Categories</a></li>
            <li><a href="offers.html" class="footer-link">Offers</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6 class="fw-bold">Customer Service</h6>
          <ul class="list-unstyled small">
            <li><a href="contact.html" class="footer-link">Contact Us</a></li>
            <li><a href="#" class="footer-link">Shipping Info</a></li>
            <li><a href="#" class="footer-link">Returns</a></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6 class="fw-bold">Get in Touch</h6>
          <ul class="list-unstyled small">
            <li><i class="bi bi-envelope me-2"></i>support@shopme.com</li>
            <li><i class="bi bi-telephone me-2"></i>+1 234 567 8900</li>
            <li><i class="bi bi-clock me-2"></i>Mon - Sat: 9AM - 8PM</li>
          </ul>
          <div class="social-icons mt-2">
            <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
            <a href="#" class="text-white me-3"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-white"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
      <div class="text-center border-top border-secondary pt-3 small mt-4">
        &copy; <span id="year"></span> SHOPME. All rights reserved. Made with <i class="bi bi-heart-fill text-danger"></i> by a student.
      </div>
    </div>
  </footer>
`;

function searchSubmit(e) {
  const q = document.getElementById("navbarSearch").value.trim();
  if (q) window.location.href = "products.html?search=" + encodeURIComponent(q);
  return false;
}

function injectLayout() {
  const navRoot = document.getElementById("navRoot");
  if (navRoot) navRoot.innerHTML = NAVBAR_HTML;
  const footerRoot = document.getElementById("footerRoot");
  if (footerRoot) footerRoot.innerHTML = FOOTER_HTML;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

async function checkAuth() {
  try {
    const data = await fetchJson(API.auth.me);
    currentUser = data.user;
    renderAuthButtons();
  } catch (e) {
    currentUser = null;
  }
}

function renderAuthButtons() {
  const el = document.getElementById("authButtons");
  if (!el) return;
  if (currentUser) {
    el.innerHTML = `
      <div class="dropdown d-inline-block">
        <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle"></i> ${currentUser.name}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="cart.html">My Cart</a></li>
          <li><a class="dropdown-item" href="favorites.html">My Favorites</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
        </ul>
      </div>`;
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", doLogout);
  } else {
    el.innerHTML = `<a href="login.html" class="btn btn-light btn-sm">Login</a>`;
  }
}

async function doLogout(e) {
  e.preventDefault();
  try {
    await fetch(API.auth.logout, { method: "POST" });
  } catch (e) { /* ignore */ }
  currentUser = null;
  window.location.reload();
}

function addToCart(productId, qty = 1) {
  loadCart();
  const existing = cart.find(c => c.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart();
  updateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  updateCartCount();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  const el = document.getElementById("cartCountNav");
  if (el) el.textContent = count;
}

function toggleFavorite(productId) {
  loadFavs();
  const idx = favorites.indexOf(productId);
  if (idx >= 0) favorites.splice(idx, 1);
  else favorites.push(productId);
  saveFavs();
  updateFavCount();
}

function isFav(productId) {
  return favorites.includes(productId);
}

function updateFavCount() {
  const el = document.getElementById("favCountNav");
  if (el) el.textContent = favorites.length;
}

function productCardHTML(p) {
  const stars = "\u2605".repeat(Math.round(p.rating)) + "\u2606".repeat(5 - Math.round(p.rating));
  const favIcon = isFav(p.id) ? "bi-heart-fill text-danger" : "bi-heart";
  const availClass = p.availability === "In Stock" ? "success" : p.availability === "Low Stock" ? "warning" : "danger";
  return `
    <div class="col">
      <div class="product-card h-100" data-id="${p.id}">
        <div class="position-relative">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
          <button class="btn btn-light btn-sm position-absolute top-0 end-0 m-2 rounded-circle fav-btn" data-fav="${p.id}">
            <i class="bi ${favIcon}"></i>
          </button>
        </div>
        <div class="p-3 d-flex flex-column flex-grow-1">
          <small class="text-muted">${p.shop}</small>
          <h6 class="fw-semibold mt-1 mb-1">${p.name}</h6>
          <div class="small mb-1" style="color:#f59e0b;">${stars} <span class="text-muted">(${p.rating})</span></div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="product-price">${currency(p.price)}</span>
            <span class="badge bg-${availClass} availability-badge">${p.availability}</span>
          </div>
          <button class="btn btn-primary btn-sm mt-2 add-to-cart-btn" data-add="${p.id}">
            <i class="bi bi-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>`;
}

function bindProductGridEvents(root = document) {
  root.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(parseInt(btn.dataset.add));
      btn.innerHTML = '<i class="bi bi-check"></i> Added';
      setTimeout(() => btn.innerHTML = '<i class="bi bi-cart-plus"></i> Add', 1200);
    });
  });
  root.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleFavorite(parseInt(btn.dataset.fav));
      const icon = btn.querySelector("i");
      icon.className = isFav(parseInt(btn.dataset.fav)) ? "bi bi-heart-fill text-danger" : "bi bi-heart";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  injectLayout();
  loadCart();
  loadFavs();
  updateCartCount();
  updateFavCount();
  checkAuth();
});
