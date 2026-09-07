/* =========================================================
   ShopVerse — JavaScript Logic (frontend)
   Data is fetched from the Node/Express API (/api/*).
   ========================================================= */

/* ---------- 1. GLOBAL STATE ---------- */
let products = [];   // loaded from GET /api/products
let shops = [];      // loaded from GET /api/shops
let categories = []; // loaded from GET /api/categories
let offers = [];     // loaded from GET /api/offers

const API = {
  products: "/api/products",
  shops: "/api/shops",
  categories: "/api/categories",
  offers: "/api/offers",
  orders: "/api/orders"
};

/* ---------- 2. HELPERS ---------- */
let cart = [];          // [{id, qty}]
let favorites = [];     // [id]

const currency = (n) => "$" + n.toFixed(2);

/* ---------- 3. STORAGE (persist across reloads) ---------- */
function saveCart()   { localStorage.setItem("sv_cart", JSON.stringify(cart)); }
function saveFavs()   { localStorage.setItem("sv_favs", JSON.stringify(favorites)); }

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem("sv_cart")) || []; }
  catch (e) { cart = []; }
}

function loadFavs() {
  try { favorites = JSON.parse(localStorage.getItem("sv_favs")) || []; }
  catch (e) { favorites = []; }
}

/* ---------- 4. API DATA LOADING ---------- */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

/** Load all site data from the backend, then populate the UI. */
async function init() {
  try {
    const [pData, sData, cData, oData] = await Promise.all([
      fetchJson(API.products),
      fetchJson(API.shops),
      fetchJson(API.categories),
      fetchJson(API.offers)
    ]);

    products = pData.products;
    shops = sData.shops;
    categories = cData.categories;
    offers = oData.offers;

    // state + render
    loadCart();
    loadFavs();
    document.getElementById("year").textContent = new Date().getFullYear();
    initFilterOptions();
    renderShops();
    renderCategories();
    renderOffers();
    renderProducts();
    renderFavorites();
    updateCart();
    updateFavCount();
    createScrollTop();
    bindGlobalEvents();
  } catch (err) {
    console.error("Failed to load data from the API:", err);
    document.getElementById("noProducts").classList.remove("d-none");
  }
/* ---------- 5. RENDER SHOPS / CATEGORIES / OFFERS ---------- */
function renderShops() {
  const grid = document.getElementById("shopsGrid");
  grid.innerHTML = shops.map(s => `
    <div class="col-md-6 col-lg-4">
      <a href="#products" class="info-card shop-card" style="border-top: 5px solid ${s.color}">
        <div class="info-card-body">
          <div class="mb-2" style="font-size:2.2rem;color:${s.color}"><i class="bi ${s.icon}"></i></div>
          <h5>${s.name}</h5>
          <p class="text-muted small mb-0">${s.tagline}</p>
        </div>
      </a>
    </div>`).join("");
}

function renderCategories() {
  const grid = document.getElementById("categoriesGrid");
  grid.innerHTML = categories.map(c => {
    const count = products.filter(p => p.category === c.name).length;
    return `
    <div class="col-6 col-md-4 col-lg-3 text-center">
      <button class="info-card category-tile" data-cat="${c.name}" style="border-bottom: 5px solid ${c.color}">
        <div class="info-card-body">
          <div class="mb-2" style="font-size:2.4rem;color:${c.color}"><i class="bi ${c.icon}"></i></div>
          <h5>${c.name}</h5>
        </div>
      </button>
    </div>`;
  }).join("");

  // Clicking a category sets the filter and scrolls to products
  document.querySelectorAll(".category-tile").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("filterCategory").value = btn.dataset.cat;
      document.getElementById("navbarSearch").value = "";
      renderProducts();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function renderOffers() {
  const grid = document.getElementById("offersGrid");
  grid.innerHTML = offers.map(o => `
    <div class="col-md-6 col-lg-3">
      <div class="info-card offer-card">
        <div class="info-card-body text-center">
          <div class="mb-2" style="font-size:2.2rem;color:${o.color}"><i class="bi ${o.icon}"></i></div>
          <h5>${o.title}</h5>
          <p class="text-muted small mb-0">${o.text}</p>
          <span class="badge text-bg-warning mt-2">Limited Time</span>
        </div>
      </div>
    </div>`).join("");
}

/* ---------- 6. RATING STARS ---------- */
function starHTML(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="bi bi-star-fill"></i>';
    else if (rating >= i - 0.5) html += '<i class="bi bi-star-half"></i>';
    else html += '<i class="bi bi-star"></i>';
  }
  return `<span class="rating-stars">${html}</span> <span class="rating-num">(${rating})</span>`;
}

/* ---------- 7. FAVORITES HELPERS ---------- */
function isFav(id) { return favorites.includes(id); }

function toggleFav(id, btnEl) {
  const idx = favorites.indexOf(id);
  if (idx === -1) {
    favorites.push(id);
  } else {
    favorites.splice(idx, 1);
  }
  saveFavs();
  updateFavCount();
  renderProducts();       // refresh heart states on product cards
  renderFavorites();
  renderModalHeart(id);   // update modal button if open
}

function updateFavCount() {
  document.getElementById("favCountNav").textContent = favorites.length;
}
/* ---------- 8. PRODUCT CARD TEMPLATE ---------- */
function productCard(p) {
  const fav = isFav(p.id);
  const favBtnClass = fav ? "active" : "";
  const favIcon = fav ? "bi-heart-fill" : "bi-heart";
  const availabilityBadge = p.availability === "Out of Stock"
    ? '<span class="badge rounded-pill text-bg-secondary">Out of Stock</span>'
    : (p.availability === "Low Stock"
        ? '<span class="badge rounded-pill text-bg-warning">Low Stock</span>'
        : '<span class="badge rounded-pill text-bg-success">In Stock</span>');
  const disabled = p.availability === "Out of Stock" ? "disabled" : "";

  return `
  <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
    <div class="card product-card h-100">
      <div class="product-img-wrapper">
        <img src="${p.unique_photo}" class="card-img-top product-img" alt="${p.name}">
        <button class="fav-btn ${favBtnClass}" data-fav-id="${p.id}" title="Toggle favorite" aria-label="Toggle favorite">
          <i class="bi ${favIcon}"></i>
        </button>
      </div>
      <div class="card-body card-body-flex">
        <span class="product-category">${p.category}</span>
        <h6 class="card-title product-name">${p.name}</h6>
        <span class="product-shop"><i class="bi bi-shop me-1"></i>${p.shop}</span>
        <div class="mb-1">${starHTML(p.rating)}</div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="product-price">${currency(p.price)}</span>
          ${availabilityBadge}
        </div>
        <div class="d-grid gap-2 mt-auto">
          <button class="btn btn-sm btn-primary" data-add-cart="${p.id}" ${disabled}>
            <i class="bi bi-cart-plus me-1"></i>Add to Cart
          </button>
          <button class="btn btn-sm btn-outline-secondary" data-view="${p.id}">
            <i class="bi bi-eye me-1"></i>View Details
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------- 9. SEARCH & FILTERS ---------- */
function getFilters() {
  return {
    search: (document.getElementById("navbarSearch").value || "").trim().toLowerCase(),
    category: document.getElementById("filterCategory").value,
    shop: document.getElementById("filterShop").value,
    price: parseFloat(document.getElementById("filterPrice").value) || 0,
    rating: parseFloat(document.getElementById("filterRating").value) || 0
  };
}

function applyFilters(list) {
  const f = getFilters();
  let result = list.slice();

  if (f.search) {
    result = result.filter(p => p.name.toLowerCase().includes(f.search) ||
                                p.category.toLowerCase().includes(f.search) ||
                                p.shop.toLowerCase().includes(f.search));
  }
  if (f.category !== "all") result = result.filter(p => p.category === f.category);
  if (f.shop !== "all") result = result.filter(p => p.shop === f.shop);
  if (f.price > 0) result = result.filter(p => p.price <= f.price);
  if (f.rating > 0) result = result.filter(p => p.rating >= f.rating);

  return result;
}

function initFilterOptions() {
  const catSel = document.getElementById("filterCategory");
  const shopSel = document.getElementById("filterShop");

  const uniqueCats = [...new Set(products.map(p => p.category))];
  const uniqueShops = [...new Set(products.map(p => p.shop))];

  uniqueCats.forEach(c =>
    catSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
  uniqueShops.forEach(s =>
    shopSel.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
}

function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const shown = applyFilters(products);
  const noProd = document.getElementById("noProducts");

  grid.innerHTML = shown.map(productCard).join("");

  // count info
  document.getElementById("productCountInfo").textContent =
    `${shown.length} of ${products.length} products`;

  // toggle no-products alert
  noProd.classList.toggle("d-none", shown.length > 0);

  bindCardEvents();
}

/* ---------- 10. BIND EVENTS ON CURRENT PRODUCT CARDS ---------- */
function bindCardEvents() {
  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleFav(parseInt(btn.dataset.favId), btn));
  });
  document.querySelectorAll("[data-add-cart]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.addCart)));
  });
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => showModal(parseInt(btn.dataset.view)));
  });
}

/* ---------- 11. FAVORITES SECTION ---------- */
function renderFavorites() {
  const grid = document.getElementById("favoritesGrid");
  const noFav = document.getElementById("noFavorites");
  const favProducts = products.filter(p => favorites.includes(p.id));

  grid.innerHTML = favProducts.map(productCard).join("");

  noFav.classList.toggle("d-none", favProducts.length > 0);

  // re-bind heart + cart + view events inside favorites
  document.querySelectorAll("#favoritesGrid .fav-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleFav(parseInt(btn.dataset.favId)));
  });
  document.querySelectorAll("#favoritesGrid [data-add-cart]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(parseInt(btn.dataset.addCart)));
  });
  document.querySelectorAll("#favoritesGrid [data-view]").forEach(btn => {
    btn.addEventListener("click", () => showModal(parseInt(btn.dataset.view)));
  });
}
/* ---------- 12. CART LOGIC ---------- */
function getCartItem(id) { return cart.find(i => i.id === id); }

function cartQty(id) {
  const it = getCartItem(id);
  return it ? it.qty : 0;
}

function cartLineTotal(id) {
  const p = products.find(x => x.id === id);
  return p ? p.price * cartQty(id) : 0;
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p || p.availability === "Out of Stock") return;
  const it = getCartItem(id);
  if (it) it.qty++;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCart();
  renderProducts();   // refresh any disabled states (not necessary but harmless)
}

function setQty(id, qty) {
  const it = getCartItem(id);
  if (!it) return;
  it.qty = qty;
  if (it.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function cartCount() {
  return cart.reduce((acc, i) => acc + i.qty, 0);
}

function updateCart() {
  // navbar + offcanvas counters
  const count = cartCount();
  document.getElementById("cartCountNav").textContent = count;

  const body = document.getElementById("cartItems");
  const emptyBox = document.getElementById("cartEmpty");
  const subtotalEl = document.getElementById("cartSubtotal");

  if (cart.length === 0) {
    body.innerHTML = "";
    emptyBox.classList.remove("d-none");
    subtotalEl.textContent = currency(0);
    document.getElementById("cartTotal").textContent = currency(0);
    document.getElementById("cartShipping").textContent = "Free";
    return;
  }

  emptyBox.classList.add("d-none");

  body.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    return `
    <div class="cart-item">
      <img src="${p.unique_photo}" alt="${p.name}">
      <div class="cart-item-info">
        <div class="d-flex justify-content-between align-items-start">
          <span class="cart-item-name">${p.name}</span>
          <button class="remove-btn ms-auto" data-remove="${p.id}" title="Remove" aria-label="Remove">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="cart-item-price">${currency(p.price)} each</div>
        <div class="d-flex align-items-center mt-1">
          <button class="btn btn-outline-secondary btn-sm qty-btn" data-dec="${p.id}" aria-label="Decrease">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="btn btn-outline-secondary btn-sm qty-btn" data-inc="${p.id}" aria-label="Increase">+</button>
          <span class="ms-2 text-muted">= <strong>${currency(cartLineTotal(p.id))}</strong></span>
        </div>
      </div>
    </div>`;
  }).join("");

  const sub = cart.reduce((acc, i) => acc + cartLineTotal(i.id), 0);
  const shipping = 0; // free shipping in this demo
  subtotalEl.textContent = currency(sub);
  document.getElementById("cartShipping").textContent = shipping === 0 ? "Free" : currency(shipping);
  document.getElementById("cartTotal").textContent = currency(sub + shipping);

  // bind cart item events
  document.querySelectorAll("[data-remove]").forEach(b =>
    b.addEventListener("click", () => removeFromCart(parseInt(b.dataset.remove))));
  document.querySelectorAll("[data-dec]").forEach(b => {
    b.addEventListener("click", () => {
      const id = parseInt(b.dataset.dec);
      setQty(id, cartQty(id) - 1);
    });
  });
  document.querySelectorAll("[data-inc]").forEach(b => {
    b.addEventListener("click", () => {
      const id = parseInt(b.dataset.inc);
      setQty(id, cartQty(id) + 1);
    });
  });
}

/* ---------- 13. CHECKOUT (posts the order to the backend) ---------- */
async function checkout() {
  if (cart.length === 0) return;
  const msg = document.getElementById("checkoutMsg");
  const btn = document.getElementById("checkoutBtn");

  const payload = {
    items: cart.map(i => ({ id: i.id, qty: i.qty })),
    customer: { name: "ShopVerse Visitor", email: "visitor@shopverse.demo" }
  };

  btn.disabled = true;
  try {
    const res = await fetch(API.orders, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`POST /api/orders failed: ${res.status}`);
    const data = await res.json();

    clearCart();
    msg.classList.remove("d-none");
    msg.innerHTML =
      `<i class="bi bi-check-circle me-1"></i>Order #${data.order.id} placed! Thank you for shopping with us.`;
  } catch (err) {
    console.error(err);
    msg.classList.remove("d-none");
    msg.classList.remove("alert-success");
    msg.classList.add("alert-danger");
    msg.innerHTML = `<i class="bi bi-exclamation-triangle me-1"></i>Could not place your order. Please try again.`;
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      msg.classList.add("d-none");
      msg.classList.remove("alert-danger");
      msg.classList.add("alert-success");
    }, 4500);
  }
}
/* ---------- 14. PRODUCT DETAIL MODAL ---------- */
let modalProduct = null;

function showModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  modalProduct = p;

  const availClass = p.availability === "In Stock" ? "text-bg-success"
    : (p.availability === "Low Stock" ? "text-bg-warning" : "text-bg-secondary");

  const fav = isFav(p.id);
  const favIcon = fav ? "bi-heart-fill" : "bi-heart";
  const favLabel = fav ? "Remove from Favorites" : "Add to Favorites";
  const cartDisabled = p.availability === "Out of Stock" ? "disabled" : "";

  document.getElementById("productModalLabel").textContent = p.name;
  document.getElementById("productModalBody").innerHTML = `
    <div class="row">
      <div class="col-md-5">
        <img src="${p.unique_photo}" class="modal-product-img" alt="${p.name}">
      </div>
      <div class="col-md-7">
        <span class="product-category mb-1">${p.category}</span>
        <h4 class="mt-2">${p.name}</h4>
        <p class="product-shop mb-2"><i class="bi bi-shop me-1"></i><strong>Shop:</strong> ${p.shop}</p>
        <p class="mb-1">${starHTML(p.rating)}</p>
        <p class="mb-3 mt-1"><span class="availability-badge badge rounded-pill ${availClass}">${p.availability}</span></p>
        <hr>
        <p class="mb-1 text-muted"><strong>Description:</strong></p>
        <p class="small">${p.description}</p>
        <div class="modal-price mb-3">${currency(p.price)}</div>
      </div>
    </div>`;

  document.getElementById("productModalFooter").innerHTML = `
    <button type="button" class="btn btn-outline-danger" data-modal-fav="${p.id}">
      <i class="bi ${favIcon} me-1"></i>${favLabel}
    </button>
    <button type="button" class="btn btn-primary" data-modal-cart="${p.id}" ${cartDisabled}>
      <i class="bi bi-cart-plus me-1"></i>Add to Cart
    </button>`;

  // bind modal footer buttons (they were added after body render)
  document.querySelector("[data-modal-fav]").addEventListener("click", () =>
    toggleFav(parseInt(document.querySelector("[data-modal-fav]").dataset.modalFav)));

  document.querySelector("[data-modal-cart]").addEventListener("click", () => {
    addToCart(parseInt(document.querySelector("[data-modal-cart]").dataset.modalCart));
  });

  // Open the modal. In the browser, `bootstrap` is a global from the Bootstrap bundle.
  const bs = window.bootstrap || globalThis.bootstrap || null;
  if (bs) {
    const modal = new bs.Modal(document.getElementById("productModal"));
    modal.show();
  }
}

// Keep the modal heart button in sync after toggling favorites
function renderModalHeart(id) {
  if (!modalProduct || modalProduct.id !== id) return;
  const btn = document.querySelector("[data-modal-fav]");
  if (!btn) return;
  const fav = isFav(id);
  btn.innerHTML = fav
    ? '<i class="bi bi-heart-fill me-1"></i>Remove from Favorites'
    : '<i class="bi bi-heart me-1"></i>Add to Favorites';
}

/* ---------- 15. CONTACT FORM VALIDATION ---------- */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleContactSubmit(e) {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const subject = document.getElementById("contactSubject");
  const message = document.getElementById("contactMessage");
  const success = document.getElementById("contactSuccess");

  // reset
  [name, email, subject, message].forEach(el => el.classList.remove("is-invalid"));
  success.classList.add("d-none");

  if (!name.value.trim()) { name.classList.add("is-invalid"); valid = false; }
  if (!email.value.trim() || !validateEmail(email.value)) {
    email.classList.add("is-invalid"); valid = false;
    document.getElementById("emailFeedback").textContent =
      !email.value.trim() ? "Please enter your email address." : "Please enter a valid email address.";
  }
  if (!subject.value.trim()) { subject.classList.add("is-invalid"); valid = false; }
  if (!message.value.trim() || message.value.trim().length < 10) {
    message.classList.add("is-invalid"); valid = false;
  }

  if (!valid) return;

  // success path
  e.target.reset();
  success.classList.remove("d-none");
}
/* ---------- 16. SCROLL TO TOP BUTTON ---------- */
function createScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.id = "scrollTopBtn";
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  btn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 17. GLOBAL EVENT LISTENERS ---------- */
function bindGlobalEvents() {
  document.getElementById("navbarSearch").addEventListener("input", renderProducts);

  document.getElementById("filterCategory").addEventListener("change", renderProducts);
  document.getElementById("filterShop").addEventListener("change", renderProducts);
  document.getElementById("filterPrice").addEventListener("input", renderProducts);
  document.getElementById("filterRating").addEventListener("input", renderProducts);

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("filterCategory").value = "all";
    document.getElementById("filterShop").value = "all";
    document.getElementById("filterPrice").value = "";
    document.getElementById("filterRating").value = "";
    document.getElementById("navbarSearch").value = "";
    renderProducts();
  });

  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (cart.length > 0) {
      if (confirm("Clear all items from your cart?")) clearCart();
    }
  });

  document.getElementById("checkoutBtn").addEventListener("click", checkout);

  document.getElementById("contactForm").addEventListener("submit", handleContactSubmit);
}

/* ---------- 18. INITIALIZE ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the modal footer has the id the app expects.
  const footer = document.querySelector("#productModal .modal-footer");
  if (footer) footer.id = "productModalFooter";

  init();
});
}