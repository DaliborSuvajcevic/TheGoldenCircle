// ============================================================
// THE GOLDEN CIRCLE — SITE CONFIGURATION
// Edit the products below to add real prices, images and links.
// ============================================================
const products = [
  {
    name: "Golden Starter Kit",
    catKey: "cat_trading",
    descKey: "p1_d",
    price: "FREE",
    priceKey: "price_free",
    image: "assets/products/starter-kit.webp",
    link: "https://goldenboyy.gumroad.com/l/xvexk"
  },
  {
    name: "Golden Masterclass",
    catKey: "cat_trading",
    descKey: "p2_d",
    price: "299€",
    image: "assets/products/masterclass.webp",
    link: "https://goldenboyy.gumroad.com/l/nwidl"
  },
  {
    name: "AI Prompt Collection",
    catKey: "cat_ai",
    descKey: "p3_d",
    price: "4.99€",
    image: "assets/products/ai-prompts.webp",
    link: "https://goldenboyy.gumroad.com/l/wfoepq"
  },
  {
    name: "Golden Highlight Packs",
    catKey: "cat_design",
    descKey: "p4_d",
    price: "4.99€",
    image: "assets/products/highlights.webp",
    link: "https://goldenboyy.gumroad.com/l/vqoem"
  }
];

// ============================================================
// LANGUAGE (EN / SR), strings live in i18n.js
// ============================================================
const LANG_KEY = "goldencircle-lang";
let currentLang = "en";
const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;

function getInitialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl && I18N[fromUrl.toLowerCase()]) return fromUrl.toLowerCase();
  } catch (e) { /* ignore */ }
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved && I18N[saved]) return saved;
  } catch (e) { /* storage can be blocked */ }
  return "en";
}

const grid = document.getElementById("product-grid");
const toast = document.querySelector(".toast");
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const isUsableLink = (url) => /^https:\/\//i.test(url) && !url.includes("YOUR_PRODUCT_LINK_HERE");

function renderProducts() {
  if (!grid) return;
  grid.innerHTML = products.map((product) => {
    const safeName = escapeHTML(product.name);
    const safeImage = escapeHTML(product.image);
    const safeCategory = escapeHTML(t(product.catKey));
    const safeDescription = escapeHTML(t(product.descKey));
    const safePrice = escapeHTML(product.priceKey ? t(product.priceKey) : product.price);
    const link = isUsableLink(product.link)
      ? `<a class="product-link" href="${escapeHTML(product.link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t("view_product"))}</a>`
      : `<span class="product-link product-link-disabled" aria-label="${escapeHTML(t("link_missing"))}">${escapeHTML(t("coming_soon"))}</span>`;

    return `
      <article class="product-card reveal visible">
        <div class="product-media">
          <img src="${safeImage}" alt="${safeName}" loading="lazy" />
        </div>
        <div class="product-info">
          <p class="eyebrow">${safeCategory}</p>
          <h3>${safeName}</h3>
          <p>${safeDescription}</p>
          <div class="product-meta">
            <span class="product-price">${safePrice}</span>
            ${link}
          </div>
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll(".product-media img").forEach((img) => {
    img.addEventListener("error", () => {
      img.hidden = true;
      img.parentElement.classList.add("product-media-missing");
      img.parentElement.setAttribute("aria-label", `${t("img_missing")}: ${img.alt}`);
    }, { once: true });
  });
}
// (products are rendered by applyLang below)

// Scroll reveal, with a fallback for browsers without IntersectionObserver.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((element) => observer.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add("visible"));
}

// Mobile navigation
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
function closeNavigation() {
  nav?.classList.remove("open");
  toggle?.setAttribute("aria-expanded", "false");
  toggle?.setAttribute("aria-label", t("nav_open"));
}
toggle?.addEventListener("click", () => {
  if (!nav) return;
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? t("nav_close") : t("nav_open"));
});
nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
window.addEventListener("resize", () => {
  if (window.innerWidth > 650) closeNavigation();
}, { passive: true });

// Desktop cursor light
const glow = document.querySelector(".cursor-glow");
if (glow && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth <= 650) return;
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Placeholder Discord link handling
const discordLink = document.querySelector('[data-placeholder="discord"]');
let toastTimeout;
discordLink?.addEventListener("click", (event) => {
  if (discordLink.getAttribute("href") === "#") {
    event.preventDefault();
    if (!toast) return;
    toast.classList.add("show");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("show"), 3200);
  }
});

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function applyLang(lang, save = true) {
  if (!I18N[lang]) lang = "en";
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
  document.title = t("meta_title");
  const setMeta = (selector, value) => { const m = document.querySelector(selector); if (m) m.setAttribute("content", value); };
  setMeta('meta[name="description"]', t("meta_desc"));
  setMeta('meta[property="og:title"]', t("og_title"));
  setMeta('meta[property="og:description"]', t("og_desc"));
  document.querySelectorAll(".lang-btn").forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang)));
  toggle?.setAttribute("aria-label", nav?.classList.contains("open") ? t("nav_close") : t("nav_open"));
  renderProducts();
  setYear();
  if (save) { try { window.localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ } }
}

document.querySelectorAll(".lang-btn").forEach((btn) => btn.addEventListener("click", () => applyLang(btn.dataset.lang)));
applyLang(getInitialLang(), false);
