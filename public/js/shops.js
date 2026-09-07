(async () => {
  try {
    const data = await fetchJson(API.shops);
    const grid = document.getElementById("shopsGrid");
    if (!grid) return;
    grid.innerHTML = (data.shops || []).map(s => `
      <div class="col-md-4">
        <div class="card h-100 p-4 shop-card">
          <i class="bi ${s.icon} fs-1" style="color:${s.color};"></i>
          <h5 class="fw-bold mt-3">${s.name}</h5>
          <p class="text-muted">${s.tagline}</p>
          <a href="products.html?shop=${encodeURIComponent(s.name)}" class="btn btn-outline-primary btn-sm mt-auto">Browse Products</a>
        </div>
      </div>`).join("");
  } catch (err) {
    console.error("Shops page load failed:", err.message);
  }
})();
