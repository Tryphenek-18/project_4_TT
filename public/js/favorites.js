(async () => {
  loadFavs();
  const empty = document.getElementById("favEmpty");
  const grid = document.getElementById("favoritesGrid");

  if (favorites.length === 0) {
    if (empty) empty.classList.remove("d-none");
    if (grid) grid.classList.add("d-none");
    return;
  }

  try {
    const data = await fetchJson(API.products);
    const favProducts = (data.products || []).filter(p => favorites.includes(p.id));

    if (empty) empty.classList.add("d-none");
    if (grid) {
      grid.classList.remove("d-none");
      grid.innerHTML = favProducts.map(p => productCardHTML(p)).join("");
      bindProductGridEvents(grid);
    }
  } catch (err) {
    console.error("Favorites page load failed:", err.message);
  }
})();
