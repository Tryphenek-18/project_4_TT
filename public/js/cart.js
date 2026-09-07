async function renderCart() {
  loadCart();
  const empty = document.getElementById("cartEmpty");
  const content = document.getElementById("cartContent");
  const itemsRoot = document.getElementById("cartItems");

  if (cart.length === 0) {
    if (empty) empty.classList.remove("d-none");
    if (content) content.classList.add("d-none");
    return;
  }

  if (empty) empty.classList.add("d-none");
  if (content) content.classList.remove("d-none");

  // Fetch product details for each cart item
  const enriched = [];
  let subtotal = 0;
  for (const item of cart) {
    try {
      const p = await fetchJson(API.products + "/" + item.id);
      const lineTotal = p.price * item.qty;
      subtotal += lineTotal;
      enriched.push({ ...p, qty: item.qty, lineTotal });
    } catch (e) {
      console.error("Failed to load product", item.id, e.message);
    }
  }

  const shipping = 0;
  const total = subtotal + shipping;

  if (itemsRoot) {
    itemsRoot.innerHTML = enriched.map(p => `
      <div class="card p-3 mb-3">
        <div class="row g-3 align-items-center">
          <div class="col-3 col-md-2"><img src="${p.image}" alt="${p.name}" class="img-fluid rounded"></div>
          <div class="col-9 col-md-5"><h6 class="fw-bold mb-1">${p.name}</h6><small class="text-muted">${p.shop}</small></div>
          <div class="col-6 col-md-2"><span class="product-price">${currency(p.price)}</span></div>
          <div class="col-3 col-md-2"><input type="number" min="1" value="${p.qty}" data-qty="${p.id}" class="form-control form-control-sm qty-input"></div>
          <div class="col-3 col-md-1"><button class="btn btn-danger btn-sm" data-remove="${p.id}"><i class="bi bi-trash"></i></button></div>
        </div>
      </div>`).join("");

    itemsRoot.querySelectorAll(".qty-input").forEach(inp => {
      inp.addEventListener("change", () => {
        const id = parseInt(inp.dataset.qty);
        const v = parseInt(inp.value) || 1;
        inp.value = v;
        const item = cart.find(c => c.id === id);
        if (item) { item.qty = v; saveCart(); }
        renderCart();
      });
    });
    itemsRoot.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        removeFromCart(parseInt(btn.dataset.remove));
        renderCart();
      });
    });
  }

  const subEl = document.getElementById("cartSubtotal");
  const shipEl = document.getElementById("cartShipping");
  const totEl = document.getElementById("cartTotal");
  if (subEl) subEl.textContent = currency(subtotal);
  if (shipEl) shipEl.textContent = currency(shipping);
  if (totEl) totEl.textContent = currency(total);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearCartBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }
      try {
        const res = await fetch(API.orders, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart, customer: { name: currentUser.name, email: currentUser.email } })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Checkout failed");
        clearCart();
        alert("Order placed successfully! Order #" + data.order.id);
        window.location.href = "index.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCart();
      renderCart();
    });
  }
});
