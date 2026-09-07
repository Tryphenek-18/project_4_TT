(async () => {
  try {
    // Load featured products (first 8)
    const pdata = await fetchJson(API.products);
    const featured = (pdata.products || []).slice(0, 8);
    const grid = document.getElementById("featuredProducts");
    if (grid) {
      grid.innerHTML = featured.map(p => productCardHTML(p)).join("");
      bindProductGridEvents(grid);
    }

    // Load shops
    const sdata = await fetchJson(API.shops);
    const shopsGrid = document.getElementById("homeShops");
    if (shopsGrid) {
      const shops = (sdata.shops || []).slice(0, 6);
      shopsGrid.innerHTML = shops.map(s => `
        <div class="col-md-4 col-lg-2">
          <div class="card h-100 text-center p-3">
            <i class="bi ${s.icon} fs-1" style="color:${s.color};"></i>
            <h6 class="fw-bold mt-2">${s.name}</h6>
            <small class="text-muted">${s.tagline}</small>
          </div>
        </div>`).join("");
    }

    // Load offers
    const odata = await fetchJson(API.offers);
    const offersGrid = document.getElementById("homeOffers");
    if (offersGrid) {
      const offers = (odata.offers || []).slice(0, 4);
      offersGrid.innerHTML = offers.map(o => `
        <div class="col-md-6">
          <div class="card p-4 h-100 offer-card">
            <div class="d-flex align-items-center">
              <i class="bi ${o.icon} fs-1 me-3" style="color:${o.color};"></i>
              <div>
                <h5 class="fw-bold">${o.title}</h5>
                <p class="text-muted mb-0">${o.text}</p>
              </div>
            </div>
          </div>
        </div>`).join("");
    }
  } catch (err) {
    console.error("Home page load failed:", err.message);
    const root = document.getElementById("featuredProducts");
    if (root) root.innerHTML = `<div class="alert alert-danger">Unable to load products. Start the server with <code>npm start</code> and open via <code>http://localhost:3000</code>.</div>`;
  }
})();
