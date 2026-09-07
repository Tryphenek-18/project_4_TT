(async () => {
  try {
    const data = await fetchJson(API.offers);
    const grid = document.getElementById("offersGrid");
    if (!grid) return;
    grid.innerHTML = (data.offers || []).map(o => `
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
  } catch (err) {
    console.error("Offers page load failed:", err.message);
  }
})();
