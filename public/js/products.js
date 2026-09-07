let allProducts = [];

function loadFilters() {
  fetchJson(API.categories).then(d => {
    const sel = document.getElementById("filterCategory");
    if (!sel) return;
    (d.categories || []).forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      sel.appendChild(opt);
    });
  });
  fetchJson(API.shops).then(d => {
    const sel = document.getElementById("filterShop");
    if (!sel) return;
    (d.shops || []).forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = s.name;
      sel.appendChild(opt);
    });
  });
}

function renderProducts(products) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;
  if (products.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><h5 class="text-muted">No products found</h5></div>`;
    return;
  }
  grid.innerHTML = products.map(p => productCardHTML(p)).join("");
  bindProductGridEvents(grid);
}

function applyFilters() {
  const search = (document.getElementById("searchInput") || {}).value || "";
  const category = (document.getElementById("filterCategory") || {}).value || "all";
  const shop = (document.getElementById("filterShop") || {}).value || "all";

  let filtered = allProducts;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }
  if (category && category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }
  if (shop && shop !== "all") {
    filtered = filtered.filter(p => p.shop === shop);
  }
  renderProducts(filtered);
}

(async () => {
  loadFilters();
  try {
    const data = await fetchJson(API.products);
    allProducts = data.products || [];

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      const input = document.getElementById("searchInput");
      if (input) input.value = searchParam;
    }
    const catParam = params.get("category");
    if (catParam) {
      const sel = document.getElementById("filterCategory");
      if (sel) sel.value = catParam;
    }

    applyFilters();
  } catch (err) {
    console.error("Products page load failed:", err.message);
    const grid = document.getElementById("productsGrid");
    if (grid) grid.innerHTML = `<div class="alert alert-danger">Unable to load products. Start the server with <code>npm start</code>.</div>`;
  }

  const btn = document.getElementById("applyFilters");
  if (btn) btn.addEventListener("click", applyFilters);
})();
