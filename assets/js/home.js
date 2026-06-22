// Home page logic — hero showcase rotator + per-category sections + value deals + rooftop slider
document.addEventListener("DOMContentLoaded", async () => {
  // Pull latest Categories/Items from Google Sheets (if configured) before
  // rendering, so changes made from any device show up here too. Falls back
  // instantly to the local cache if this is slow/offline.
  await Store.syncContent();

  const cats = Store.categories();

  // ---- Hero showcase ----
  let activeCat = cats[0];
  let idx = 0;
  const navEl = document.getElementById("heroCatNav");
  const imgEl = document.getElementById("heroImg");
  const txtEl = document.getElementById("heroText");
  const dotsEl = document.getElementById("heroDots");

  function renderNav() {
    navEl.innerHTML = cats
      .map(
        (c) =>
          `<button data-c="${c}" class="shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider border transition ${
            c === activeCat
              ? "bg-brand text-white border-brand shadow-brand"
              : "bg-white/5 border-white/10 text-white/70 hover:border-brand hover:text-white"
          }">${c}</button>`
      )
      .join("");
    navEl.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        activeCat = b.dataset.c;
        idx = 0;
        render();
      })
    );
  }
  function render() {
    const items = Store.itemsByCategory(activeCat);
    renderNav();
    if (!items.length) {
      imgEl.src = "";
      imgEl.alt = "";
      dotsEl.innerHTML = "";
      txtEl.innerHTML = `
        <div class="text-gold text-[11px] sm:text-xs font-black uppercase tracking-[0.3em]">${activeCat}</div>
        <h2 class="mt-2 text-2xl sm:text-3xl md:text-4xl font-black uppercase leading-tight">Coming Soon</h2>
        <p class="mt-3 text-white/60 text-sm leading-relaxed max-w-md mx-auto md:mx-0">No items in this category yet — check back soon, or browse the full menu.</p>
        <div class="mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
          <a href="menu.html" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:border-brand transition">Full Menu <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></a>
        </div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }
    const it = items[idx % items.length];
    const variants = Store.itemVariants(it);
    const hasVariants = variants.length > 0;
    let selected = hasVariants ? variants[0] : null;
    imgEl.src = it.img;
    imgEl.alt = it.name;
    imgEl.classList.remove("animate-scale-in");
    void imgEl.offsetWidth;
    imgEl.classList.add("animate-scale-in");
    txtEl.classList.remove("animate-fade-in");
    void txtEl.offsetWidth;
    txtEl.classList.add("animate-fade-in");
    txtEl.innerHTML = `
      <div class="text-gold text-[11px] sm:text-xs font-black uppercase tracking-[0.3em]">${
        it.category
      }</div>
      <h2 class="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight">${
        it.name
      }</h2>
      <p class="mt-2 italic text-brand font-semibold text-sm sm:text-base">"${
        it.slogan || ""
      }"</p>
      <p class="mt-3 text-white/70 text-sm leading-relaxed max-w-md mx-auto md:mx-0">${
        it.description || ""
      }</p>
      <div class="mt-4 inline-flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
        <span class="text-[10px] uppercase tracking-widest text-white/50">Price</span>
        <span id="heroPrice" class="text-gold font-black text-sm sm:text-base">${
          hasVariants ? `Rs ${selected.price}` : it.price
        }</span>
      </div>
      ${
        hasVariants
          ? `
      <div id="heroVariants" class="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
        ${variants
          .map(
            (v, i) =>
              `<button type="button" data-variant-i="${i}" class="yz-variant-btn shrink-0 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition ${
                i === 0
                  ? "bg-brand text-white border-brand"
                  : "bg-white/5 border-white/10 text-white/70 hover:border-brand hover:text-white"
              }">${v.label}</button>`
          )
          .join("")}
      </div>`
          : ""
      }
      <div class="mt-5 flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
        <button id="heroAdd" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand text-white text-xs font-black uppercase tracking-widest shadow-brand hover:scale-105 transition"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Add To Cart</button>
        <a href="menu.html" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:border-brand transition">Full Menu <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></a>
        <a href="${
          YZ_CONFIG.PHONE_TEL
        }" class="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition"><i data-lucide="phone" class="w-3.5 h-3.5"></i> Call</a>
      </div>`;
    dotsEl.innerHTML = items
      .map(
        (_, i) =>
          `<button data-i="${i}" class="h-1.5 rounded-full transition-all ${
            i === idx ? "w-8 bg-brand" : "w-1.5 bg-white/20"
          }"></button>`
      )
      .join("");
    dotsEl.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        idx = +b.dataset.i;
        render();
      })
    );
    if (hasVariants) {
      const priceEl = document.getElementById("heroPrice");
      document
        .querySelectorAll("#heroVariants [data-variant-i]")
        .forEach((btn) =>
          btn.addEventListener("click", () => {
            selected = variants[Number(btn.dataset.variantI)];
            document
              .querySelectorAll("#heroVariants [data-variant-i]")
              .forEach((b) => {
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
    document.getElementById("heroAdd").addEventListener("click", () => {
      Store.addToCart(it, 1, selected);
      YZ_openCart();
    });
    if (window.lucide) lucide.createIcons();
  }
  document.getElementById("heroPrev").addEventListener("click", () => {
    const items = Store.itemsByCategory(activeCat);
    if (!items.length) return;
    idx = (idx - 1 + items.length) % items.length;
    render();
  });
  document.getElementById("heroNext").addEventListener("click", () => {
    const items = Store.itemsByCategory(activeCat);
    if (!items.length) return;
    idx = (idx + 1) % items.length;
    render();
  });
  render();

  // ---- Per-category sections ----
  const sectionsEl = document.getElementById("categorySections");
  cats.forEach((cat) => {
    const items = Store.itemsByCategory(cat).slice(0, 4);
    if (!items.length) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="flex items-end justify-between mb-5">
        <div><span class="text-gold text-[10px] sm:text-xs font-black uppercase tracking-widest">Category</span><h3 class="mt-1 text-2xl sm:text-3xl md:text-4xl font-black uppercase">${cat}</h3></div>
        <a href="menu.html#${encodeURIComponent(
          cat
        )}" class="text-xs font-black uppercase tracking-widest text-brand hover:underline">View All →</a>
      </div>`;
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5";
    items.forEach((it) => grid.appendChild(renderCard(it)));
    wrap.appendChild(grid);
    sectionsEl.appendChild(wrap);
  });
  if (window.lucide) lucide.createIcons();

  // ---- Deals (BIGG Deals combo cards + Value Deals list) ----
  // Both pull from Store.deals(), synced via Google Sheets (admin.html → Deals tab).
  // Markup below is unchanged from the site's original static cards — only the
  // data source moved from hardcoded HTML to Store.
  const deals = Store.deals();
  const biggEl = document.getElementById("biggDeals");
  if (biggEl) {
    const bigg = deals.filter((d) => d.type !== "value");
    biggEl.innerHTML = bigg
      .map((d, i) =>
        d.highlight
          ? `
      <div class="relative rounded-2xl p-6 border border-gold bg-gradient-to-br from-gold to-amber-500 text-black hover:-translate-y-1 transition" data-aos="fade-up" ${
        i ? `data-aos-delay="${i * 80}"` : ""
      }>
        <div class="text-xs font-black uppercase tracking-widest text-black/70">${
          d.label
        }</div>
        <div class="mt-3 text-3xl font-black text-black">Rs ${d.price}</div>
        <p class="mt-3 text-sm text-black/80">${d.desc}</p>
        <a href="tel:+923300000817" class="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black">Order Now <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></a>
      </div>`
          : `
      <div class="relative rounded-2xl p-6 border border-border bg-card hover:border-brand hover:-translate-y-1 transition" data-aos="fade-up" ${
        i ? `data-aos-delay="${i * 80}"` : ""
      }>
        <div class="text-xs font-black uppercase tracking-widest text-gold">${
          d.label
        }</div>
        <div class="mt-3 text-3xl font-black text-white">Rs ${d.price}</div>
        <p class="mt-3 text-sm text-white/70">${d.desc}</p>
        <a href="tel:+923300000817" class="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand">Order Now <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></a>
      </div>`
      )
      .join("");
  }
  const vdEl = document.getElementById("valueDeals");
  if (vdEl) {
    const vd = deals.filter((d) => d.type === "value");
    vdEl.innerHTML = vd
      .map(
        (v) => `
    <div class="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-brand transition" data-aos="fade-up">
      <div class="grid place-items-center w-14 h-14 rounded-lg bg-brand text-white font-black text-xl shrink-0">${v.label}</div>
      <div class="flex-1"><div class="text-sm text-white/80">${v.desc}</div><div class="text-gold font-black mt-1">Rs ${v.price}</div></div>
    </div>`
      )
      .join("");
  }

  // ---- Reviews carousel ----
  const track = document.getElementById("reviewsTrack");
  if (track) {
    const slides = Array.from(track.children);
    let rIdx = 0;
    function perView() {
      return window.innerWidth >= 768 ? 3 : 1;
    }
    function maxIdx() {
      return Math.max(0, slides.length - perView());
    }
    function goTo(i) {
      rIdx = Math.min(Math.max(0, i), maxIdx());
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 24; // gap-6
      track.style.transform = `translateX(-${rIdx * (slideWidth + gap)}px)`;
    }
    document
      .getElementById("reviewsPrev")
      .addEventListener("click", () => goTo(rIdx - 1));
    document
      .getElementById("reviewsNext")
      .addEventListener("click", () => goTo(rIdx + 1));
    window.addEventListener("resize", () => goTo(rIdx));
    goTo(0);
  }

  // ---- Rooftop slider ----
  const rooftop = [
    "assets/img/yumzee-rooftop.jpg",
    "assets/img/yumzee-rooftop-2.jpg",
    "assets/img/yumzee-rooftop-3.jpg",
    "assets/img/yumzee-rooftop-4.jpg",
  ];
  const stage = document.getElementById("rooftopStage");
  const thumbs = document.getElementById("rooftopThumbs");
  let rg = 0;
  if (stage) {
    stage.innerHTML = rooftop
      .map(
        (s, i) =>
          `<img src="${s}" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === 0 ? "opacity-100" : "opacity-0"
          }" data-r="${i}"/>`
      )
      .join("");
    thumbs.innerHTML = rooftop
      .map(
        (s, i) =>
          `<button data-i="${i}" class="relative overflow-hidden rounded-lg aspect-square border transition ${
            i === 0
              ? "border-brand shadow-brand"
              : "border-white/10 opacity-70 hover:opacity-100"
          }"><img src="${s}" class="w-full h-full object-cover"/></button>`
      )
      .join("");
    const setG = (i) => {
      rg = i;
      stage
        .querySelectorAll("img")
        .forEach(
          (im, j) =>
            im.classList.toggle("opacity-100", j === i) ||
            im.classList.toggle("opacity-0", j !== i)
        );
      thumbs.querySelectorAll("button").forEach((b, j) => {
        b.className = `relative overflow-hidden rounded-lg aspect-square border transition ${
          j === i
            ? "border-brand shadow-brand"
            : "border-white/10 opacity-70 hover:opacity-100"
        }`;
      });
    };
    thumbs
      .querySelectorAll("button")
      .forEach((b) => b.addEventListener("click", () => setG(+b.dataset.i)));
    setInterval(() => setG((rg + 1) % rooftop.length), 5000);
  }

  // ---- Gallery ----
  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    const photos = Store.gallery();
    galleryGrid.innerHTML = photos
      .map((g, i) => {
        const spanClass =
          i % 8 === 0
            ? "row-span-2"
            : i % 8 === 3 || i % 8 === 7
            ? "col-span-2"
            : "";
        return `
      <button data-gallery="${
        g.img
      }" class="relative overflow-hidden rounded-xl border border-border group ${spanClass}">
        <img src="${g.img}" alt="${
          g.caption || "Yumzee"
        }" class="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
        ${
          g.caption
            ? `<span class="absolute bottom-2 left-3 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white">${g.caption}</span>`
            : ""
        }
      </button>`;
      })
      .join("");
    // Note: the lightbox click listeners for these buttons are wired in ui.js,
    // which runs its DOMContentLoaded handler after this one (script order),
    // so it picks up these freshly-rendered [data-gallery] buttons automatically.
  }

  // ---- Team ----
  const teamGrid = document.getElementById("teamGrid");
  if (teamGrid) {
    const team = Store.team();
    teamGrid.innerHTML = team
      .map(
        (m, i) => `
      <div class="group bg-card border border-border rounded-2xl p-6 text-center hover:border-brand hover:-translate-y-1 transition" data-aos="fade-up" ${
        i ? `data-aos-delay="${i * 80}"` : ""
      }>
        <div class="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white/5 border border-border ring-4 ring-black overflow-hidden">
          ${
            m.img
              ? `<img src="${m.img}" alt="${m.name}" class="w-full h-full object-cover"/>`
              : ""
          }
        </div>
        <h3 class="mt-5 font-black uppercase tracking-wider text-sm">${
          m.name
        }</h3>
        <div class="text-[10px] uppercase tracking-[0.25em] text-brand font-bold mt-1">${
          m.role
        }</div>
        <p class="mt-3 text-xs sm:text-sm text-white/65 leading-relaxed">${
          m.bio || ""
        }</p>
      </div>`
      )
      .join("");
  }

  // AOS refresh after dynamic content
  if (window.AOS) AOS.refresh();

  // Loading screen is no longer needed — page data is ready and rendered.
  const loader = document.getElementById("yzLoader");
  if (loader) {
    loader.classList.add("yz-loader-hidden");
    setTimeout(() => loader.remove(), 400);
  }
});
