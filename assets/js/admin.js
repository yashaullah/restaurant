document.addEventListener("DOMContentLoaded", () => {
  // Access gate — must have logged in via login.html first
  const ok = sessionStorage.getItem("yz.admin") === "1";
  if (!ok) {
    location.href = "login.html";
    return;
  }
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("yz.admin");
    location.href = "index.html";
  });

  // Tabs
  document.querySelectorAll(".admin-tab").forEach((t) =>
    t.addEventListener("click", () => {
      document
        .querySelectorAll(".admin-tab")
        .forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document
        .querySelectorAll(".admin-panel")
        .forEach((p) => p.classList.add("hidden"));
      document
        .querySelector(`[data-panel="${t.dataset.tab}"]`)
        .classList.remove("hidden");
    })
  );

  // Categories
  function renderCats() {
    const cats = Store.categories();
    document.getElementById("catList").innerHTML = cats
      .map(
        (c) => `
      <div class="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <span class="font-bold uppercase tracking-wider text-sm">${c}</span>
        <button data-rm="${c}" class="text-xs text-white/40 hover:text-brand">Delete</button>
      </div>`
      )
      .join("");
    document.querySelectorAll("#catList [data-rm]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm(`Delete category "${b.dataset.rm}" and all its items?`))
          return;
        b.textContent = "...";
        const res = await Store.removeCategory(b.dataset.rm);
        renderCats();
        fillCatSelect();
        renderItems();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      })
    );
  }
  document.getElementById("catForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const name = e.target.name.value.trim();
    if (!name) return;
    const prevLabel = btn.textContent;
    btn.textContent = "Adding…";
    btn.disabled = true;
    const res = await Store.addCategory(name);
    e.target.reset();
    renderCats();
    fillCatSelect();
    btn.textContent = prevLabel;
    btn.disabled = false;
    YZ_toast(
      res && res.ok === false
        ? `Saved locally — Sheets sync failed: ${res.error}`
        : `Added ${name}`
    );
  });
  function fillCatSelect() {
    const sel = document.getElementById("itemCat");
    sel.innerHTML = Store.categories()
      .map((c) => `<option value="${c}">${c}</option>`)
      .join("");
  }

  // Items
  function renderItems() {
    const list = document.getElementById("itemList");
    list.innerHTML = "";
    Store.items().forEach((it) => {
      const card = renderCard(it);
      const del = document.createElement("button");
      del.className =
        "absolute top-3 left-3 z-10 w-8 h-8 grid place-items-center rounded-full bg-black/80 text-white/70 hover:bg-brand hover:text-white transition";
      del.innerHTML = '<i data-lucide="trash-2" class="w-3.5 h-3.5"></i>';
      del.addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm(`Delete ${it.name}?`)) return;
        const res = await Store.removeItem(it.id);
        renderItems();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      });
      card.appendChild(del);
      list.appendChild(card);
    });
    if (window.lucide) lucide.createIcons();
  }

  // Variant/size row builder for the item form (e.g. Small/Medium/Large).
  // Each row is just two plain inputs (label + price) — collected into a
  // variants array on submit. Items with zero rows use the single `price`
  // field above as before, so this is fully backward compatible.
  const variantRowsEl = document.getElementById("variantRows");
  function addVariantRow(label = "", price = "") {
    const row = document.createElement("div");
    row.className = "flex gap-2 variant-row";
    row.innerHTML = `
      <input placeholder="Size label (e.g. Small)" value="${label}" class="variant-label flex-1 px-3 py-2 rounded-lg bg-black/40 border border-border focus:border-brand outline-none text-sm"/>
      <input placeholder="Price" value="${price}" inputmode="numeric" class="variant-price w-28 px-3 py-2 rounded-lg bg-black/40 border border-border focus:border-brand outline-none text-sm"/>
      <button type="button" class="remove-variant-row px-3 rounded-lg bg-white/5 border border-border text-white/50 hover:text-brand hover:border-brand transition text-xs">✕</button>`;
    row
      .querySelector(".remove-variant-row")
      .addEventListener("click", () => row.remove());
    variantRowsEl.appendChild(row);
  }
  document
    .getElementById("addVariantRow")
    .addEventListener("click", () => addVariantRow());

  document.getElementById("itemForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = f.querySelector('button[type="submit"], button:not([type])');
    const prevLabel = btn ? btn.textContent : "";
    if (btn) {
      btn.textContent = "Saving…";
      btn.disabled = true;
    }
    const data = {
      name: f.name.value.trim(),
      price: f.price.value.trim(),
      category: f.category.value,
      slogan: f.slogan.value.trim(),
      description: f.description.value.trim(),
      img: f.imgUrl.value.trim(),
    };
    const variants = Array.from(variantRowsEl.querySelectorAll(".variant-row"))
      .map((row) => ({
        label: row.querySelector(".variant-label").value.trim(),
        price: Number(row.querySelector(".variant-price").value.trim()) || 0,
      }))
      .filter((v) => v.label && v.price > 0);
    if (variants.length) data.variants = variants;
    const file = f.imgFile.files[0];
    if (file) {
      const uploaded = await Store.uploadContentImage(file);
      if (uploaded) data.img = uploaded;
      else {
        YZ_toast("Image upload failed — check CONTENT_WEBAPP_URL in config.js");
      }
    }
    if (!data.img) data.img = "assets/img/yumzee-pizza.png";
    const res = await Store.addItem(data);
    f.reset();
    variantRowsEl.innerHTML = "";
    renderItems();
    if (btn) {
      btn.textContent = prevLabel;
      btn.disabled = false;
    }
    YZ_toast(
      res && res.ok === false
        ? `Saved locally — Sheets sync failed: ${res.error}`
        : `Added ${data.name}`
    );
  });

  // Team
  function renderTeam() {
    const list = document.getElementById("teamList");
    list.innerHTML = Store.team()
      .map(
        (m) => `
      <div class="bg-card border border-border rounded-2xl p-5 text-center relative">
        <button data-rm="${
          m.id
        }" class="absolute top-3 left-3 z-10 w-8 h-8 grid place-items-center rounded-full bg-black/80 text-white/70 hover:bg-brand hover:text-white transition"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
        <div class="relative w-20 h-20 mx-auto rounded-full bg-white/5 border border-border ring-4 ring-black overflow-hidden">${
          m.img
            ? `<img src="${m.img}" class="w-full h-full object-cover"/>`
            : ""
        }</div>
        <input data-field="name" data-id="${m.id}" value="${
          m.name
        }" class="mt-4 w-full text-center bg-transparent border-b border-border focus:border-brand outline-none text-sm font-black uppercase tracking-wider py-1"/>
        <input data-field="role" data-id="${m.id}" value="${
          m.role
        }" class="mt-2 w-full text-center bg-transparent border-b border-border focus:border-brand outline-none text-[10px] uppercase tracking-[0.25em] text-brand font-bold py-1"/>
        <textarea data-field="bio" data-id="${
          m.id
        }" rows="2" class="mt-2 w-full text-center bg-transparent border border-border focus:border-brand outline-none text-xs text-white/65 rounded-lg p-2">${
          m.bio || ""
        }</textarea>
      </div>`
      )
      .join("");
    list.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Remove this team member?")) return;
        b.textContent = "...";
        const res = await Store.removeTeamMember(b.dataset.rm);
        renderTeam();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      })
    );
    list.querySelectorAll("[data-field]").forEach((el) =>
      el.addEventListener("change", async () => {
        const res = await Store.updateTeamMember(el.dataset.id, {
          [el.dataset.field]: el.value.trim(),
        });
        YZ_toast(
          res && res.ok === false
            ? `Saved locally — Sheets sync failed: ${res.error}`
            : "Saved"
        );
      })
    );
    if (window.lucide) lucide.createIcons();
  }
  document.getElementById("teamForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = f.querySelector("button");
    const prevLabel = btn.textContent;
    btn.textContent = "Saving…";
    btn.disabled = true;
    const data = {
      name: f.name.value.trim(),
      role: f.role.value.trim(),
      bio: f.bio.value.trim(),
      img: f.imgUrl.value.trim(),
    };
    const file = f.imgFile.files[0];
    if (file) {
      const uploaded = await Store.uploadContentImage(file);
      if (uploaded) data.img = uploaded;
      else
        YZ_toast("Image upload failed — check CONTENT_WEBAPP_URL in config.js");
    }
    const res = await Store.addTeamMember(data);
    f.reset();
    renderTeam();
    btn.textContent = prevLabel;
    btn.disabled = false;
    YZ_toast(
      res && res.ok === false
        ? `Saved locally — Sheets sync failed: ${res.error}`
        : `Added ${data.name}`
    );
  });

  // News / Announcement bar
  function renderNews() {
    const list = document.getElementById("newsList");
    const items = Store.news();
    list.innerHTML = items.length
      ? items
          .map(
            (n) => `
      <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
        <i data-lucide="megaphone" class="w-4 h-4 text-gold shrink-0"></i>
        <input data-field="text" data-id="${n.id}" value="${(
              n.text || ""
            ).replace(
              /"/g,
              "&quot;"
            )}" class="flex-1 bg-transparent border-b border-border focus:border-brand outline-none text-sm py-1"/>
        <button data-rm="${
          n.id
        }" class="text-xs text-white/40 hover:text-brand shrink-0">Delete</button>
      </div>`
          )
          .join("")
      : '<p class="text-white/40 text-sm">No announcements yet — the news bar stays hidden on the site until you add one.</p>';
    list.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Remove this announcement?")) return;
        const res = await Store.removeNews(b.dataset.rm);
        renderNews();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      })
    );
    list.querySelectorAll("[data-field]").forEach((el) =>
      el.addEventListener("change", async () => {
        const res = await Store.updateNews(el.dataset.id, {
          text: el.value.trim(),
        });
        YZ_toast(
          res && res.ok === false
            ? `Saved locally — Sheets sync failed: ${res.error}`
            : "Saved"
        );
      })
    );
    if (window.lucide) lucide.createIcons();
  }
  document.getElementById("newsForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = f.querySelector("button");
    const text = f.text.value.trim();
    if (!text) return;
    const prevLabel = btn.textContent;
    btn.textContent = "Saving…";
    btn.disabled = true;
    const res = await Store.addNews({ text });
    f.reset();
    renderNews();
    btn.textContent = prevLabel;
    btn.disabled = false;
    YZ_toast(
      res && res.ok === false
        ? `Saved locally — Sheets sync failed: ${res.error}`
        : "Announcement added"
    );
  });

  // Gallery
  function renderGalleryAdmin() {
    const list = document.getElementById("galleryAdminList");
    list.innerHTML = Store.gallery()
      .map(
        (g) => `
      <div class="relative bg-card border border-border rounded-xl overflow-hidden group">
        <button data-rm="${
          g.id
        }" class="absolute top-2 left-2 z-10 w-8 h-8 grid place-items-center rounded-full bg-black/80 text-white/70 hover:bg-brand hover:text-white transition"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
        <img src="${g.img}" class="w-full h-28 object-cover"/>
        <input data-field="caption" data-id="${g.id}" value="${(
          g.caption || ""
        ).replace(
          /"/g,
          "&quot;"
        )}" placeholder="Caption" class="w-full bg-black/40 border-t border-border focus:border-brand outline-none text-xs text-center px-2 py-2"/>
      </div>`
      )
      .join("");
    list.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Remove this photo from the gallery?")) return;
        const res = await Store.removeGalleryImage(b.dataset.rm);
        renderGalleryAdmin();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      })
    );
    list.querySelectorAll("[data-field]").forEach((el) =>
      el.addEventListener("change", async () => {
        const res = await Store.updateGalleryImage(el.dataset.id, {
          caption: el.value.trim(),
        });
        YZ_toast(
          res && res.ok === false
            ? `Saved locally — Sheets sync failed: ${res.error}`
            : "Saved"
        );
      })
    );
    if (window.lucide) lucide.createIcons();
  }
  document
    .getElementById("galleryForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.target;
      const btn = f.querySelector("button");
      const prevLabel = btn.textContent;
      btn.textContent = "Saving…";
      btn.disabled = true;
      const file = f.imgFile.files[0];
      let img = f.imgUrl.value.trim();
      if (file) {
        const uploaded = await Store.uploadContentImage(file);
        if (uploaded) img = uploaded;
        else
          YZ_toast(
            "Image upload failed — check CONTENT_WEBAPP_URL in config.js"
          );
      }
      if (!img) {
        YZ_toast("Please choose an image");
        btn.textContent = prevLabel;
        btn.disabled = false;
        return;
      }
      const res = await Store.addGalleryImage({
        caption: f.caption.value.trim(),
        img,
      });
      f.reset();
      renderGalleryAdmin();
      btn.textContent = prevLabel;
      btn.disabled = false;
      YZ_toast(
        res && res.ok === false
          ? `Saved locally — Sheets sync failed: ${res.error}`
          : "Photo added"
      );
    });

  // Deals (Combo cards + Value deals — shown in #deals on the home page)
  function renderDeals() {
    const list = document.getElementById("dealList");
    const deals = Store.deals();
    list.innerHTML = deals.length
      ? deals
          .map(
            (d) => `
      <div class="bg-card border border-border rounded-xl p-4 grid sm:grid-cols-[auto_1fr_auto_auto] gap-3 items-center">
        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
          d.type === "value"
            ? "bg-white/10 text-white/70"
            : "bg-brand/20 text-brand"
        }">${d.type === "value" ? "Value" : "Combo"}</span>
        <div class="min-w-0">
          <input data-field="label" data-id="${d.id}" value="${(
              d.label || ""
            ).replace(
              /"/g,
              "&quot;"
            )}" class="w-full bg-transparent border-b border-border focus:border-brand outline-none text-sm font-bold py-1"/>
          <input data-field="desc" data-id="${d.id}" value="${(
              d.desc || ""
            ).replace(
              /"/g,
              "&quot;"
            )}" class="w-full bg-transparent border-b border-border focus:border-brand outline-none text-xs text-white/60 py-1 mt-1"/>
        </div>
        <input data-field="price" data-id="${d.id}" value="${(d.price || "")
              .toString()
              .replace(
                /"/g,
                "&quot;"
              )}" class="w-24 bg-transparent border-b border-border focus:border-brand outline-none text-sm text-gold font-black py-1"/>
        <button data-rm="${
          d.id
        }" class="text-xs text-white/40 hover:text-brand shrink-0">Delete</button>
        ${
          d.type !== "value"
            ? `<label class="sm:col-span-4 -mt-1 flex items-center gap-2 text-xs text-white/60 cursor-pointer"><input type="checkbox" data-field="highlight" data-id="${
                d.id
              }" ${
                d.highlight ? "checked" : ""
              } class="accent-gold"/> Featured / golden card</label>`
            : ""
        }
      </div>`
          )
          .join("")
      : '<p class="text-white/40 text-sm">No deals yet — add one above.</p>';
    list.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", async () => {
        if (!confirm("Remove this deal?")) return;
        const res = await Store.removeDeal(b.dataset.rm);
        renderDeals();
        if (res && res.ok === false)
          YZ_toast("Saved locally — Sheets sync failed: " + res.error);
      })
    );
    list
      .querySelectorAll(
        'input[data-field="label"], input[data-field="desc"], input[data-field="price"]'
      )
      .forEach((el) =>
        el.addEventListener("change", async () => {
          const res = await Store.updateDeal(el.dataset.id, {
            [el.dataset.field]: el.value.trim(),
          });
          YZ_toast(
            res && res.ok === false
              ? `Saved locally — Sheets sync failed: ${res.error}`
              : "Saved"
          );
        })
      );
    list.querySelectorAll('input[data-field="highlight"]').forEach((el) =>
      el.addEventListener("change", async () => {
        const res = await Store.updateDeal(el.dataset.id, {
          highlight: el.checked,
        });
        YZ_toast(
          res && res.ok === false
            ? `Saved locally — Sheets sync failed: ${res.error}`
            : "Saved"
        );
      })
    );
  }
  document.getElementById("dealForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const btn = f.querySelector("button");
    const prevLabel = btn.textContent;
    btn.textContent = "Saving…";
    btn.disabled = true;
    const deal = {
      type: f.type.value,
      label: f.label.value.trim(),
      price: f.price.value.trim(),
      desc: f.desc.value.trim(),
      highlight: f.highlight.checked,
    };
    const res = await Store.addDeal(deal);
    f.reset();
    renderDeals();
    btn.textContent = prevLabel;
    btn.disabled = false;
    YZ_toast(
      res && res.ok === false
        ? `Saved locally — Sheets sync failed: ${res.error}`
        : `Added ${deal.label}`
    );
  });

  renderCats();
  fillCatSelect();
  renderItems();
  renderTeam();
  renderNews();
  renderGalleryAdmin();
  renderDeals();

  // Pull the latest Categories/Items/Team/News/Gallery/Deals from Google
  // Sheets (if configured) and re-render every panel when fresh data
  // arrives — picks up changes made from any other device.
  document.addEventListener("yz:content-updated", () => {
    renderCats();
    fillCatSelect();
    renderItems();
    renderTeam();
    renderNews();
    renderGalleryAdmin();
    renderDeals();
  });
  Store.syncContent();
});
