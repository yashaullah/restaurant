// Reusable card renderer used by home, menu and admin previews
window.renderCard = function (item, opts = {}) {
  const variants = Store.itemVariants(item);
  const hasVariants = variants.length > 0;
  let selected = hasVariants ? variants[0] : null;

  const card = document.createElement("div");
  card.className =
    "yz-card group relative bg-card rounded-2xl border border-border overflow-hidden flex flex-col";
  card.setAttribute("data-aos", "fade-up");
  card.innerHTML = `
    <div class="absolute top-0 left-0 right-0 h-1 bg-brand"></div>
    ${
      item.tag
        ? `<span class="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-gold text-black text-[10px] font-black uppercase tracking-wider">${item.tag}</span>`
        : ""
    }
    <div class="aspect-square grid place-items-center bg-gradient-to-br from-[#0f0606] to-black p-5 overflow-hidden">
      <img src="${item.img}" alt="${
    item.name
  }" loading="lazy" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"/>
    </div>
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="font-bold text-white text-sm sm:text-base leading-snug">${
        item.name
      }</h3>
      ${
        item.slogan
          ? `<p class="mt-1 text-xs italic text-white/50 line-clamp-1">"${item.slogan}"</p>`
          : ""
      }
      <div class="flex justify-between items-center mt-2">
        <span class="yz-price text-brand font-black text-xs sm:text-sm">${
          hasVariants
            ? `From Rs ${Math.min(
                ...variants.map((v) => Number(v.price) || 0)
              )}`
            : item.price
        }</span>
        <div class="flex text-gold gap-0.5 text-[10px]">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
      </div>
      ${
        hasVariants
          ? `
      <div class="yz-variant-picker mt-3 flex flex-wrap gap-1.5">
        ${variants
          .map(
            (v, i) =>
              `<button type="button" data-variant-i="${i}" class="yz-variant-btn shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                i === 0
                  ? "bg-brand text-white border-brand"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-brand hover:text-white"
              }">${v.label}</button>`
          )
          .join("")}
      </div>`
          : ""
      }
      <button class="add-btn mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-brand/10 border border-brand/40 text-brand text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-brand hover:text-white transition">
        <i data-lucide="plus" class="w-3 h-3"></i> Add To Cart
      </button>
    </div>`;

  if (hasVariants) {
    const priceEl = card.querySelector(".yz-price");
    card.querySelectorAll("[data-variant-i]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        selected = variants[Number(btn.dataset.variantI)];
        card.querySelectorAll("[data-variant-i]").forEach((b) => {
          const active = b === btn;
          b.classList.toggle("bg-brand", active);
          b.classList.toggle("text-white", active);
          b.classList.toggle("border-brand", active);
          b.classList.toggle("bg-white/5", !active);
          b.classList.toggle("border-white/10", !active);
          b.classList.toggle("text-white/70", !active);
        });
        priceEl.textContent = `Rs ${selected.price}`;
      })
    );
  }

  card.querySelector(".add-btn").addEventListener("click", () => {
    Store.addToCart(item, 1, selected);
    window.YZ_toast?.(
      `Added ${item.name}${selected ? ` (${selected.label})` : ""}`
    );
    window.YZ_openCart?.();
  });
  return card;
};
