document.addEventListener("DOMContentLoaded", () => {
  const no =
    new URLSearchParams(location.search).get("no") || Store.lastOrderNo();
  const order = no ? Store.getOrder(no) : null;
  if (!order) {
    document.getElementById("orderEmpty").classList.remove("hidden");
    return;
  }
  document.getElementById("orderCard").classList.remove("hidden");
  document.getElementById("orderNo").textContent = order.order_no;
  document.getElementById("orderItems").innerHTML = order.items
    .map(
      (i) =>
        `<div class="flex justify-between"><span>${i.qty}× ${i.name}${
          i.variantLabel ? ` (${i.variantLabel})` : ""
        }</span><span class="text-white/70">Rs ${i.price * i.qty}</span></div>`
    )
    .join("");
  document.getElementById("orderTotal").textContent = `Rs ${order.total}`;
  if (window.lucide) lucide.createIcons();
});
