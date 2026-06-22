// Shared UI: cart drawer, badge, toast, year, AOS init, Lucide refresh
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("yr") &&
      (document.getElementById("yr").textContent = new Date().getFullYear());
    if (window.AOS)
      AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
    if (window.lucide) lucide.createIcons();

    // Failsafe: home.js/menu.js remove the loading screen once their data is
    // ready, but if something on the page throws before that line runs, this
    // guarantees the loader never blocks the site forever.
    const loaderFailsafe = document.getElementById("yzLoader");
    if (loaderFailsafe) {
      setTimeout(() => {
        if (document.body.contains(loaderFailsafe)) {
          loaderFailsafe.classList.add("yz-loader-hidden");
          setTimeout(() => loaderFailsafe.remove(), 400);
        }
      }, 10000);
    }

    // Footer social links — read from config.js so they're a one-line edit
    // instead of a code change. Stay "#" (do nothing) until filled in.
    if (window.YZ_CONFIG) {
      const fb = document.getElementById("footerFacebook");
      if (fb && YZ_CONFIG.FACEBOOK_URL) fb.href = YZ_CONFIG.FACEBOOK_URL;
      const ig = document.getElementById("footerInstagram");
      if (ig && YZ_CONFIG.INSTAGRAM_URL) ig.href = YZ_CONFIG.INSTAGRAM_URL;
      const tt = document.getElementById("footerTiktok");
      if (tt && YZ_CONFIG.TIKTOK_URL) tt.href = YZ_CONFIG.TIKTOK_URL;
    }

    // toast root
    if (!document.getElementById("toastWrap")) {
      const w = document.createElement("div");
      w.id = "toastWrap";
      document.body.appendChild(w);
    }
    window.YZ_toast = (msg) => {
      const t = document.createElement("div");
      t.className = "toast";
      t.textContent = msg;
      document.getElementById("toastWrap").appendChild(t);
      setTimeout(() => t.remove(), 2200);
    };

    // Cart drawer wiring
    const drawer = document.getElementById("cartDrawer");
    const open = () => {
      drawer.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      renderCart();
    };
    const close = () => {
      drawer.classList.add("hidden");
      document.body.style.overflow = "";
    };
    window.YZ_openCart = open;
    document.getElementById("cartBtn")?.addEventListener("click", open);
    drawer
      ?.querySelectorAll("[data-cart-close]")
      .forEach((el) => el.addEventListener("click", close));

    function renderCart() {
      const wrap = document.getElementById("cartItems");
      const items = Store.cart();
      if (!items.length) {
        wrap.innerHTML =
          '<p class="text-white/50 text-sm text-center py-12">Your cart is empty.</p>';
      } else {
        wrap.innerHTML = items
          .map(
            (it) => `
          <div class="flex gap-3 bg-black/40 border border-border rounded-xl p-3">
            <img src="${
              it.img
            }" class="w-16 h-16 object-contain rounded-lg bg-black/40"/>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-sm truncate">${it.name}${
              it.variantLabel
                ? ` <span class="text-gold font-normal">(${it.variantLabel})</span>`
                : ""
            }</div>
              <div class="text-xs text-white/50">${it.priceLabel}</div>
              <div class="mt-2 flex items-center gap-2">
                <button data-qty="-" data-line="${
                  it.lineId
                }" class="w-7 h-7 rounded-full bg-white/5 hover:bg-brand transition grid place-items-center">−</button>
                <span class="text-sm font-bold w-6 text-center">${it.qty}</span>
                <button data-qty="+" data-line="${
                  it.lineId
                }" class="w-7 h-7 rounded-full bg-white/5 hover:bg-brand transition grid place-items-center">+</button>
                <button data-rm="${
                  it.lineId
                }" class="ml-auto text-xs text-white/40 hover:text-brand">Remove</button>
              </div>
            </div>
            <div class="text-gold font-black text-sm">Rs ${
              it.price * it.qty
            }</div>
          </div>`
          )
          .join("");
      }
      document.getElementById(
        "cartTotal"
      ).textContent = `Rs ${Store.cartTotal()}`;
      const badge = document.getElementById("cartBadge"),
        n = Store.cartCount();
      if (badge) {
        if (n > 0) {
          badge.classList.remove("hidden");
          badge.textContent = n;
        } else badge.classList.add("hidden");
      }
      wrap.querySelectorAll("[data-qty]").forEach((b) =>
        b.addEventListener("click", (e) => {
          const lineId = b.dataset.line;
          const item = Store.cart().find((x) => x.lineId === lineId);
          if (!item) return;
          Store.updateQty(lineId, item.qty + (b.dataset.qty === "+" ? 1 : -1));
        })
      );
      wrap
        .querySelectorAll("[data-rm]")
        .forEach((b) =>
          b.addEventListener("click", () => Store.removeFromCart(b.dataset.rm))
        );
    }
    document.addEventListener("cart:update", renderCart);
    renderCart();

    // Lightbox (home gallery)
    const lb = document.getElementById("lightbox");
    if (lb) {
      lb.classList.add("grid");
      lb.classList.remove("grid"); // ensure present in grid mode when shown
      document.querySelectorAll("[data-gallery]").forEach((btn) =>
        btn.addEventListener("click", () => {
          document.getElementById("lightboxImg").src = btn.dataset.gallery;
          lb.classList.remove("hidden");
          lb.classList.add("grid");
          document.body.style.overflow = "hidden";
        })
      );
      document
        .getElementById("lightboxClose")
        ?.addEventListener("click", () => {
          lb.classList.add("hidden");
          lb.classList.remove("grid");
          document.body.style.overflow = "";
        });
      lb.addEventListener("click", (e) => {
        if (e.target === lb) {
          lb.classList.add("hidden");
          lb.classList.remove("grid");
          document.body.style.overflow = "";
        }
      });
    }

    // News / announcement bar (admin-controlled via admin.html → News tab).
    // Renders instantly from the local cache so every page (including ones
    // that never call Store.syncContent(), like checkout/order/login) shows
    // the last-known announcement right away, then re-renders automatically
    // once a Google Sheets sync finishes on pages that do sync (home/menu).
    function renderNewsBar() {
      const newsBar = document.getElementById("newsBar");
      const newsTrack = document.getElementById("newsTrack");
      if (!newsBar || !newsTrack || !window.Store) return;
      const items = (Store.news() || []).filter((n) => n.text && n.text.trim());
      if (!items.length) {
        newsBar.classList.add("hidden");
        return;
      }
      const pieces = items.map(
        (n) =>
          `<span class="yz-news-item"><i data-lucide="flame" class="w-3 h-3 text-gold"></i>${n.text}</span>`
      );
      const multi = items.length > 1;
      newsBar.classList.toggle("yz-news-static", !multi);
      newsBar.classList.toggle("yz-news-scrolling", multi);
      newsTrack.classList.toggle("yz-news-scroll", multi);
      // duplicate content for seamless marquee loop when scrolling
      newsTrack.innerHTML = multi
        ? pieces.join("") + pieces.join("")
        : pieces.join("");
      newsBar.classList.remove("hidden");
      if (window.lucide) lucide.createIcons();
    }
    renderNewsBar();
    document.addEventListener("yz:content-updated", renderNewsBar);

    // GSAP ring rotation
    if (window.gsap && document.getElementById("heroRing")) {
      gsap.to("#heroRing", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    }
  });
})();
