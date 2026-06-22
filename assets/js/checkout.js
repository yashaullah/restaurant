document.addEventListener("DOMContentLoaded", () => {
  function renderSummary() {
    const wrap = document.getElementById("checkoutItems");
    const items = Store.cart();
    if (!items.length) {
      wrap.innerHTML =
        '<p class="text-white/50 text-sm">Your cart is empty. <a href="menu.html" class="text-brand">Browse menu →</a></p>';
    } else {
      wrap.innerHTML = items
        .map(
          (it) =>
            `<div class="flex justify-between text-sm gap-2"><span class="truncate">${
              it.qty
            }× ${it.name}${
              it.variantLabel ? ` (${it.variantLabel})` : ""
            }</span><span class="text-white/70 shrink-0">Rs ${
              it.price * it.qty
            }</span></div>`
        )
        .join("");
    }
    document.getElementById(
      "checkoutTotal"
    ).textContent = `Rs ${Store.cartTotal()}`;
  }
  renderSummary();

  document
    .getElementById("checkoutForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const items = Store.cart();
      if (!items.length) {
        YZ_toast("Your cart is empty");
        return;
      }
      const f = e.target;
      const btn = document.getElementById("placeBtn");
      btn.disabled = true;
      btn.textContent = "Placing order...";
      const data = Object.fromEntries(new FormData(f).entries());
      const order = {
        order_no: Store.nextOrderNo(),
        timestamp: new Date().toISOString(),
        name: data.name,
        phone: data.phone,
        address: data.address,
        notes: data.notes || "",
        items,
        total: Store.cartTotal(),
        status: "received",
      };
      // Try Google Sheets (no-cors -> opaque, so we don't depend on response)
      try {
        if (
          YZ_CONFIG.SHEETS_WEBAPP_URL &&
          !YZ_CONFIG.SHEETS_WEBAPP_URL.startsWith("PASTE")
        ) {
          await fetch(YZ_CONFIG.SHEETS_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(order),
          });
        }
      } catch (err) {
        console.warn("Sheets post failed", err);
      }

      Store.addOrder(order);
      Store.clearCart();
      location.href = `order.html?no=${order.order_no}`;
    });
});
