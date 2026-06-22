document.addEventListener("DOMContentLoaded", async () => {
  // Pull latest Categories/Items from Google Sheets before rendering the
  // menu, so it matches what's been added from any device.
  await Store.syncContent();

  const cats = ["All", ...Store.categories()];
  let active = location.hash
    ? decodeURIComponent(location.hash.slice(1))
    : "All";
  if (!cats.includes(active)) active = "All";
  const search = document.getElementById("menuSearch");
  const nav = document.getElementById("menuCatNav");
  const grid = document.getElementById("menuGrid");
  const empty = document.getElementById("menuEmpty");

  function renderNav() {
    nav.innerHTML = cats
      .map(
        (c) =>
          `<button data-c="${c}" class="shrink-0 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider border transition ${
            c === active
              ? "bg-brand text-white border-brand shadow-brand"
              : "bg-card border-border text-white/70 hover:border-brand hover:text-white"
          }">${c}</button>`
      )
      .join("");
    nav.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        active = b.dataset.c;
        render();
      })
    );
  }
  function render() {
    renderNav();
    const q = (search.value || "").toLowerCase().trim();
    let items = Store.items();
    if (active !== "All") items = items.filter((i) => i.category === active);
    if (q)
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.slogan || "").toLowerCase().includes(q)
      );
    grid.innerHTML = "";
    if (!items.length) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    items.forEach((it) => grid.appendChild(renderCard(it)));
    if (window.lucide) lucide.createIcons();
    if (window.AOS) AOS.refresh();
  }
  search.addEventListener("input", render);
  render();

  // Loading screen is no longer needed — page data is ready and rendered.
  const loader = document.getElementById("yzLoader");
  if (loader) {
    loader.classList.add("yz-loader-hidden");
    setTimeout(() => loader.remove(), 400);
  }
});
