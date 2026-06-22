// LocalStorage data layer + seed
(function () {
  const KEY = {
    cats: "yz.cats",
    items: "yz.items",
    cart: "yz.cart",
    orders: "yz.orders",
    lastOrder: "yz.lastOrder",
    seeded: "yz.seeded.v1",
    team: "yz.team",
    news: "yz.news",
    gallery: "yz.gallery",
    deals: "yz.deals",
  };
  const IMG = (n) => `assets/img/yumzee-${n}.png`;
  const IMGJ = (n) => `assets/img/yumzee-${n}.jpg`;

  const seedCats = [
    "Pizza",
    "Burgers",
    "BBQ",
    "Wraps & Rolls",
    "Quick Bites",
    "Fries & Sides",
    "Drinks",
  ];
  const seedItems = [
    {
      id: "p1",
      name: "Yumzee Special Pizza",
      category: "Pizza",
      price: "Rs 1300",
      variants: [
        { label: "Medium", price: 1300 },
        { label: "Large", price: 1850 },
      ],
      slogan: "Yumzest Pizza In The Town",
      description:
        "Loaded with premium toppings, fresh herbs and a crust baked to golden perfection.",
      img: IMG("pizza"),
    },
    {
      id: "p2",
      name: "Kabab Crust Pizza",
      category: "Pizza",
      price: "Rs 1250",
      variants: [
        { label: "Medium", price: 1250 },
        { label: "Large", price: 1750 },
      ],
      slogan: "Layers Of Flavour",
      description: "A premium pizza wrapped in a juicy seekh kabab crust.",
      img: IMG("pizza"),
      tag: "Premium",
    },
    {
      id: "p3",
      name: "Chicken Supreme",
      category: "Pizza",
      price: "Rs 650",
      variants: [
        { label: "Small", price: 650 },
        { label: "Medium", price: 1100 },
        { label: "Large", price: 1550 },
      ],
      slogan: "Tenderness In Every Bite",
      description:
        "Tender chicken, peppers, onions and melty cheese on hand-tossed dough.",
      img: IMG("pizza"),
    },
    {
      id: "p4",
      name: "Chicken Tikka Pizza",
      category: "Pizza",
      price: "Rs 600",
      variants: [
        { label: "Small", price: 600 },
        { label: "Medium", price: 1000 },
        { label: "Large", price: 1400 },
      ],
      slogan: "Desi Twist",
      description: "Classic tikka-spiced chicken on a crispy crust.",
      img: IMG("pizza"),
      tag: "Starter",
    },
    {
      id: "b1",
      name: "Zinger Tower Burger",
      category: "Burgers",
      price: "Rs 520",
      slogan: "Golden Crunch With Juicy Chicken",
      description:
        "A towering crispy fillet, hash brown, lettuce and tangy mayo.",
      img: IMG("hero-burger"),
    },
    {
      id: "b2",
      name: "Grilled Jalapeño Burger",
      category: "Burgers",
      price: "Rs 550",
      slogan: "Spice Meets Cravings",
      description:
        "Smoky grilled chicken and fiery jalapeños in a soft brioche bun.",
      img: IMG("hero-burger"),
    },
    {
      id: "b3",
      name: "Yumzee Special Burger",
      category: "Burgers",
      price: "Rs 600",
      slogan: "Say Goodbye To Ordinary Food",
      description: "Our signature double-layer burger.",
      img: IMG("hero-burger"),
      tag: "Signature",
    },
    {
      id: "b4",
      name: "Zinger Burger",
      category: "Burgers",
      price: "Rs 400",
      slogan: "Crispy Classic",
      description: "The Yumzee zinger — never disappoints.",
      img: IMG("hero-burger"),
    },
    {
      id: "q1",
      name: "Yumzee Grilled Chargha",
      category: "BBQ",
      price: "Rs 1550",
      slogan: "Grilled & Smoky Flavours",
      description:
        "A whole marinated chicken slow-grilled to smoky perfection.",
      img: IMG("bbq"),
      tag: "Special",
    },
    {
      id: "q2",
      name: "Chicken Malai Boti",
      category: "BBQ",
      price: "Rs 360",
      slogan: "Pure Tikka Feast",
      description: "Creamy malai-marinated chicken chunks over open flame.",
      img: IMG("bbq"),
    },
    {
      id: "q3",
      name: "Chicken Kalmi Tikka",
      category: "BBQ",
      price: "Rs 450",
      slogan: "Charred Goodness",
      description: "Whole leg tikka char-grilled with house spices.",
      img: IMG("bbq"),
    },
    {
      id: "q4",
      name: "6 Person BBQ Platter",
      category: "BBQ",
      price: "Rs 3999",
      slogan: "Feast Together",
      description: "Grand mix of seekh, kabab, reshmi & kalmi tikka with rice.",
      img: IMG("bbq"),
      tag: "Platter",
    },
    {
      id: "w1",
      name: "Grilled Chicken Wrap",
      category: "Wraps & Rolls",
      price: "Rs 650",
      slogan: "Wrapped With Crispy Goodness",
      description: "A flavour-packed wrap made to satisfy.",
      img: IMG("wrap"),
    },
    {
      id: "w2",
      name: "Behari Roll",
      category: "Wraps & Rolls",
      price: "Rs 400",
      slogan: "Flavor Packed Roll",
      description: "Behari-spiced chicken wrapped in soft paratha.",
      img: IMG("wrap"),
      tag: "Signature",
    },
    {
      id: "w3",
      name: "Chicken Shawarma",
      category: "Wraps & Rolls",
      price: "Rs 250",
      slogan: "Want It. Order It. Enjoy It.",
      description: "Classic shawarma with garlic sauce and pickles.",
      img: IMG("wrap"),
    },
    {
      id: "w4",
      name: "Yumzee Special Roll",
      category: "Wraps & Rolls",
      price: "Rs 400",
      slogan: "Yumzee Signature",
      description: "Our house-special roll.",
      img: IMG("wrap"),
    },
    {
      id: "k1",
      name: "Injected Broast",
      category: "Quick Bites",
      price: "From Rs 220",
      slogan: "More Flavour. More Juiciness.",
      description: "Marinade-injected fried chicken — golden crunch.",
      img: IMG("wings"),
      tag: "New",
    },
    {
      id: "k2",
      name: "Hot Wings (10 pcs)",
      category: "Quick Bites",
      price: "Rs 600",
      slogan: "Your Favourite Crunch",
      description: "Ten fiery hot wings in our house spice blend.",
      img: IMG("wings"),
    },
    {
      id: "k3",
      name: "Yumzee Special Nuggets",
      category: "Quick Bites",
      price: "Rs 750",
      slogan: "Crispy Fried Chicken Nuggets",
      description: "Hand-breaded chicken nuggets fried to perfection.",
      img: IMG("wings"),
    },
    {
      id: "k4",
      name: "Chicken Nuggets (10 pcs)",
      category: "Quick Bites",
      price: "Rs 600",
      slogan: "Crispy Classics",
      description: "Ten golden nuggets, dipping sauce on the side.",
      img: IMG("wings"),
    },
    {
      id: "f1",
      name: "Yumzee Grilled Loaded Fries",
      category: "Fries & Sides",
      price: "Rs 700",
      slogan: "Loaded With Goodness",
      description: "Fries piled high with grilled chicken, cheese and sauces.",
      img: IMG("fries"),
      tag: "Signature",
    },
    {
      id: "f2",
      name: "Loaded Fries",
      category: "Fries & Sides",
      price: "Rs 600",
      slogan: "Crispy. Cheesy. Loaded.",
      description: "Cheese and chicken on crispy fries.",
      img: IMG("fries"),
    },
    {
      id: "f3",
      name: "Family Fries",
      category: "Fries & Sides",
      price: "Rs 400",
      slogan: "Share The Crunch",
      description: "Family-size portion of signature golden fries.",
      img: IMG("fries"),
    },
    {
      id: "f4",
      name: "Regular Fries",
      category: "Fries & Sides",
      price: "Rs 250",
      slogan: "Classic Crunch",
      description: "Golden, crispy, perfectly salted.",
      img: IMG("fries"),
    },
    {
      id: "d1",
      name: "Oreo Colada",
      category: "Drinks",
      price: "Rs 350",
      variants: [
        { label: "Regular", price: 350 },
        { label: "Pet/Can", price: 400 },
      ],
      slogan: "Beat The Heat",
      description: "Creamy oreo colada blended thick.",
      img: IMG("shake"),
    },
    {
      id: "d2",
      name: "Strawberry Shake",
      category: "Drinks",
      price: "Rs 350",
      variants: [
        { label: "Regular", price: 350 },
        { label: "Pet/Can", price: 400 },
      ],
      slogan: "Sip The Sweetness",
      description: "Fresh strawberries blended with milk and ice cream.",
      img: IMG("shake"),
    },
    {
      id: "d3",
      name: "Mint Mojito",
      category: "Drinks",
      price: "Rs 300",
      variants: [
        { label: "Regular", price: 300 },
        { label: "Pet/Can", price: 350 },
      ],
      slogan: "Refresh Your Cravings",
      description: "Cool mint, fresh lime and bubbly soda.",
      img: IMG("shake"),
    },
    {
      id: "d4",
      name: "Cold Coffee w/ Ice Cream",
      category: "Drinks",
      price: "Rs 350",
      slogan: "Brewed Bliss",
      description: "Iced coffee topped with vanilla ice cream.",
      img: IMG("shake"),
    },
  ];

  const seedTeam = [
    {
      id: "t1",
      name: "Chef Adnan",
      role: "Head Chef",
      bio: "20+ years crafting signature flavours from kitchens across Pakistan.",
      img: "",
    },
    {
      id: "t2",
      name: "Chef Sameer",
      role: "Pizza Chef",
      bio: "The mind behind our hand-stretched dough and wood-fired pies.",
      img: "",
    },
    {
      id: "t3",
      name: "Chef Imran",
      role: "BBQ Master",
      bio: "Master of smoke and char — every skewer is a masterpiece.",
      img: "",
    },
    {
      id: "t4",
      name: "Ali Raza",
      role: "Service Manager",
      bio: "Makes sure every guest feels like family from the moment they arrive.",
      img: "",
    },
  ];

  const seedNews = [
    {
      id: "n1",
      text: "Open Daily • After Maghrib — Indoor + Rooftop Family Dining",
    },
  ];

  const seedGallery = [
    { id: "g1", img: "assets/img/yumzee-rooftop.jpg", caption: "Rooftop" },
    { id: "g2", img: "assets/img/yumzee-pizza.png", caption: "Pizza Oven" },
    { id: "g3", img: "assets/img/yumzee-bbq.png", caption: "Smoky BBQ" },
    {
      id: "g4",
      img: "assets/img/yumzee-rooftop-2.jpg",
      caption: "Dining Area",
    },
    { id: "g5", img: "assets/img/yumzee-wrap.png", caption: "Fresh Wraps" },
    { id: "g6", img: "assets/img/yumzee-rooftop-3.jpg", caption: "Lounge" },
    { id: "g7", img: "assets/img/yumzee-fries.png", caption: "Loaded Fries" },
    { id: "g8", img: "assets/img/yumzee-rooftop-4.jpg", caption: "Open Sky" },
  ];

  // type:'bigg' = combo cards at the top of #deals, type:'value' = the
  // compact list below. highlight:true = golden "Birthday Deal"-style card.
  const seedDeals = [
    {
      id: "dl1",
      type: "bigg",
      label: "BIGG NO. 1",
      price: "2900",
      desc: "1 Large Pizza + 2 Zinger + 10 Hot Wings + 1.5L Drink",
      highlight: false,
    },
    {
      id: "dl2",
      type: "bigg",
      label: "BIGG NO. 4",
      price: "2400",
      desc: "1 Large Pizza + 15 Hot Wings + 1.5L Drink",
      highlight: false,
    },
    {
      id: "dl3",
      type: "bigg",
      label: "FAMILY DEAL",
      price: "3950",
      desc: "1 Large Pizza + 2 Zinger + 10 Wings + 10 Nuggets + 2 Roll + 1.5L Drink",
      highlight: false,
    },
    {
      id: "dl4",
      type: "bigg",
      label: "BIRTHDAY DEAL",
      price: "7000",
      desc: "1 Large + 1 Medium Pizza + Pasta + 2 Behari Roll + 3 Zingers + Wings + 2×1.5L Drinks + Ice Cake",
      highlight: true,
    },
    {
      id: "dl5",
      type: "value",
      label: "01",
      price: "470",
      desc: "Zinger Burger + Soft Drink",
    },
    {
      id: "dl6",
      type: "value",
      label: "03",
      price: "670",
      desc: "Zinger + Reg Fries + Soft Drink",
    },
    {
      id: "dl7",
      type: "value",
      label: "06",
      price: "1000",
      desc: "2 Zinger + Reg Fries + 500ml Drink",
    },
    {
      id: "dl8",
      type: "value",
      label: "08",
      price: "2450",
      desc: "5 Zinger + Family Fries + 1.5L Drink",
    },
    {
      id: "dl9",
      type: "value",
      label: "11",
      price: "1400",
      desc: "2 Zinger + 5 Hot Wings + Fries + Drink",
    },
    {
      id: "dl10",
      type: "value",
      label: "15",
      price: "1800",
      desc: "2 Grilled Burgers + Club Sandwich + Fries + Drink",
    },
  ];

  const get = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) ?? d;
    } catch {
      return d;
    }
  };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  // Like get(), but guarantees an array is returned. If localStorage holds a
  // corrupted / non-array value under this key, repair it back to the default
  // so list.push()/map()/filter() never crashes for any future visitor.
  const getList = (k, d) => {
    const v = get(k, d);
    if (Array.isArray(v)) return v;
    set(k, d);
    return d;
  };

  if (!localStorage.getItem(KEY.seeded)) {
    set(KEY.cats, seedCats);
    set(KEY.items, seedItems);
    set(KEY.team, seedTeam);
    set(KEY.news, seedNews);
    set(KEY.gallery, seedGallery);
    set(KEY.deals, seedDeals);
    localStorage.setItem(KEY.seeded, "1");
  }

  // parse "Rs 1300 / 1850" -> 1300 (legacy fallback for any item without structured variants)
  function parsePrice(s) {
    if (!s) return 0;
    const m = String(s).replace(/,/g, "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  // Items can have multiple sizes/prices (e.g. Small/Medium/Large pizza,
  // Regular/Pet-Can drinks). variants is stored as a real array in local
  // seed data, but Google Sheets only stores plain text in a cell — so when
  // it comes back from the Content Sheet it arrives as a JSON *string*.
  // This always returns a clean array (or [] if the item has no variants),
  // regardless of which form it came in as.
  function normalizeVariants(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === "string" && v.trim()) {
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  const Store = {
    KEY,
    categories: () => getList(KEY.cats, seedCats),
    items: () => getList(KEY.items, seedItems),
    itemsByCategory: (c) => Store.items().filter((i) => i.category === c),

    // ---- Google Sheets content sync (Categories, Items, Team, News, Gallery) ----
    // categories()/items()/team()/news()/gallery() all still read the local
    // cache instantly (so pages never show empty while loading). syncContent()
    // fetches the latest from the Content Apps Script, updates the cache, and
    // fires 'yz:content-updated' so any page can re-render with fresh data.
    syncContent: async () => {
      const url = window.YZ_CONFIG && window.YZ_CONFIG.CONTENT_WEBAPP_URL;
      if (!url || url.indexOf("PASTE_YOUR") === 0) return false;
      try {
        // Hard timeout — if the Apps Script is slow/unreachable, give up after
        // 8s and fall back to the local cache rather than leaving the page
        // (and its loading screen) stuck waiting forever.
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();
        if (Array.isArray(data.categories)) set(KEY.cats, data.categories);
        if (Array.isArray(data.items)) set(KEY.items, data.items);
        if (Array.isArray(data.team)) set(KEY.team, data.team);
        if (Array.isArray(data.news)) set(KEY.news, data.news);
        if (Array.isArray(data.gallery)) set(KEY.gallery, data.gallery);
        if (Array.isArray(data.deals)) set(KEY.deals, data.deals);
        document.dispatchEvent(new CustomEvent("yz:content-updated"));
        return true;
      } catch (err) {
        console.warn("Yumzee: could not sync content from Google Sheets", err);
        return false;
      }
    },
    // POST helper for the Content Apps Script. Resolves to {ok, ...} or
    // {ok:false, error} if the request itself fails (e.g. offline).
    contentPost: async (payload) => {
      const url = window.YZ_CONFIG && window.YZ_CONFIG.CONTENT_WEBAPP_URL;
      if (!url || url.indexOf("PASTE_YOUR") === 0) {
        return {
          ok: false,
          error: "CONTENT_WEBAPP_URL is not configured in config.js",
        };
      }
      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        return await res.json();
      } catch (err) {
        return { ok: false, error: String(err) };
      }
    },
    // Uploads a File object to Drive via the Content Apps Script, returns the public URL.
    uploadContentImage: async (file) => {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const res = await Store.contentPost({
        action: "uploadImage",
        filename: file.name,
        mimeType: file.type,
        base64,
      });
      return res.ok ? res.url : null;
    },

    addCategory: async (name) => {
      const c = Store.categories();
      if (!c.includes(name)) {
        c.push(name);
        set(KEY.cats, c);
      }
      return Store.contentPost({ action: "addCategory", name });
    },
    removeCategory: async (name) => {
      set(
        KEY.cats,
        Store.categories().filter((c) => c !== name)
      );
      set(
        KEY.items,
        Store.items().filter((i) => i.category !== name)
      );
      return Store.contentPost({ action: "removeCategory", name });
    },
    addItem: async (item) => {
      item.id = item.id || "x" + Date.now();
      const list = Store.items();
      list.push(item);
      set(KEY.items, list);
      return Store.contentPost({ action: "addItem", item });
    },
    removeItem: async (id) => {
      set(
        KEY.items,
        Store.items().filter((i) => i.id !== id)
      );
      return Store.contentPost({ action: "removeItem", id });
    },
    updateItem: async (id, patch) => {
      set(
        KEY.items,
        Store.items().map((i) => (i.id === id ? { ...i, ...patch } : i))
      );
      return Store.contentPost({ action: "updateItem", id, patch });
    },

    cart: () => getList(KEY.cart, []),
    setCart: (c) => {
      set(KEY.cart, c);
      document.dispatchEvent(new CustomEvent("cart:update"));
    },
    itemVariants: (item) => normalizeVariants(item.variants),
    // variant (optional): { label, price } chosen from item.variants. When an
    // item has variants, each distinct size gets its own cart line (so a
    // Small and a Large of the same pizza can both sit in the cart at once,
    // each correctly priced) — they're matched by id+variant label, not id alone.
    addToCart: (item, qty = 1, variant = null) => {
      const c = Store.cart();
      const lineId = variant ? `${item.id}::${variant.label}` : item.id;
      const existing = c.find((x) => x.lineId === lineId);
      if (existing) existing.qty += qty;
      else
        c.push({
          lineId,
          id: item.id,
          name: item.name,
          variantLabel: variant ? variant.label : null,
          price: variant ? Number(variant.price) || 0 : parsePrice(item.price),
          priceLabel: variant ? `Rs ${variant.price}` : item.price,
          img: item.img,
          category: item.category,
          qty,
        });
      Store.setCart(c);
    },
    updateQty: (lineId, qty) => {
      const c = Store.cart()
        .map((x) => (x.lineId === lineId ? { ...x, qty } : x))
        .filter((x) => x.qty > 0);
      Store.setCart(c);
    },
    removeFromCart: (lineId) =>
      Store.setCart(Store.cart().filter((x) => x.lineId !== lineId)),
    clearCart: () => Store.setCart([]),
    cartTotal: () => Store.cart().reduce((s, x) => s + x.price * x.qty, 0),
    cartCount: () => Store.cart().reduce((s, x) => s + x.qty, 0),

    orders: () => getList(KEY.orders, []),
    addOrder: (order) => {
      const o = Store.orders();
      o.unshift(order);
      set(KEY.orders, o);
      set(KEY.lastOrder, order.order_no);
      return order;
    },
    lastOrderNo: () => get(KEY.lastOrder, null),
    getOrder: (no) => Store.orders().find((o) => o.order_no === no),
    nextOrderNo: () => {
      const o = Store.orders();
      const max = o.reduce(
        (m, x) => Math.max(m, parseInt(x.order_no) || 0),
        1000
      );
      return String(max + 1);
    },

    team: () => getList(KEY.team, seedTeam),
    addTeamMember: async (member) => {
      member.id = member.id || "m" + Date.now();
      const list = Store.team();
      list.push(member);
      set(KEY.team, list);
      return Store.contentPost({ action: "addTeamMember", member });
    },
    updateTeamMember: async (id, patch) => {
      set(
        KEY.team,
        Store.team().map((m) => (m.id === id ? { ...m, ...patch } : m))
      );
      return Store.contentPost({ action: "updateTeamMember", id, patch });
    },
    removeTeamMember: async (id) => {
      set(
        KEY.team,
        Store.team().filter((m) => m.id !== id)
      );
      return Store.contentPost({ action: "removeTeamMember", id });
    },

    news: () => getList(KEY.news, seedNews),
    addNews: async (item) => {
      item.id = item.id || "news" + Date.now();
      const list = Store.news();
      list.push(item);
      set(KEY.news, list);
      return Store.contentPost({ action: "addNews", item });
    },
    updateNews: async (id, patch) => {
      set(
        KEY.news,
        Store.news().map((n) => (n.id === id ? { ...n, ...patch } : n))
      );
      return Store.contentPost({ action: "updateNews", id, patch });
    },
    removeNews: async (id) => {
      set(
        KEY.news,
        Store.news().filter((n) => n.id !== id)
      );
      return Store.contentPost({ action: "removeNews", id });
    },

    gallery: () => getList(KEY.gallery, seedGallery),
    addGalleryImage: async (item) => {
      item.id = item.id || "g" + Date.now();
      const list = Store.gallery();
      list.push(item);
      set(KEY.gallery, list);
      return Store.contentPost({ action: "addGalleryImage", item });
    },
    updateGalleryImage: async (id, patch) => {
      set(
        KEY.gallery,
        Store.gallery().map((g) => (g.id === id ? { ...g, ...patch } : g))
      );
      return Store.contentPost({ action: "updateGalleryImage", id, patch });
    },
    removeGalleryImage: async (id) => {
      set(
        KEY.gallery,
        Store.gallery().filter((g) => g.id !== id)
      );
      return Store.contentPost({ action: "removeGalleryImage", id });
    },

    deals: () => getList(KEY.deals, seedDeals),
    addDeal: async (deal) => {
      deal.id = deal.id || "dl" + Date.now();
      const list = Store.deals();
      list.push(deal);
      set(KEY.deals, list);
      return Store.contentPost({ action: "addDeal", deal });
    },
    updateDeal: async (id, patch) => {
      set(
        KEY.deals,
        Store.deals().map((d) => (d.id === id ? { ...d, ...patch } : d))
      );
      return Store.contentPost({ action: "updateDeal", id, patch });
    },
    removeDeal: async (id) => {
      set(
        KEY.deals,
        Store.deals().filter((d) => d.id !== id)
      );
      return Store.contentPost({ action: "removeDeal", id });
    },
  };

  window.Store = Store;
  window.parsePrice = parsePrice;
})();
