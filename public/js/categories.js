(async () => {
  try {
    const data = await fetchJson(API.categories);
    const grid = document.getElementById("categoriesGrid");
    if (!grid) return;
    grid.innerHTML = (data.categories || []).map(c => `
      <div class="col-md-4 col-lg-3">
        <a href="products.html?category=${encodeURIComponent(c.name)}" class="text-decoration-none">
          <div class="card h-100 p-4 text-center category-card">
            <i class="bi ${c.icon} fs-1" style="color:${c.color};"></i>
            <h6 class="fw-bold mt-2 text-dark">${c.name}</h6>
          </div>
        </a>
      </div>`).join("");
  } catch (err) {
    console.error("Categories page load failed:", err.message);
  }
})();
