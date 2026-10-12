// ============================================================
// THE GOLDEN CIRCLE — SITE CONFIGURATION
// Edit the products below to add real prices, images and links.
// ============================================================
const products = [
  {
    name: "Golden Starter Kit",
    category: "TRADING / EDUCATION",
    description: "A clear introduction to forex, the market structure and the foundations behind my approach.",
    price: "FREE",
    image: "assets/products/starter-kit.png",
    link: "https://goldenboyy.gumroad.com/l/xvexk"
  },
  {
    name: "Golden Masterclass",
    category: "TRADING / EDUCATION",
    description: "The complete trading framework and strategy, organized into one practical masterclass.",
    price: "299€",
    image: "assets/products/masterclass.png",
    link: "https://goldenboyy.gumroad.com/l/nwidl"
  },
  {
    name: "AI Prompt Collection",
    category: "AI / DIGITAL",
    description: "Six practical prompts built around content, brand clarity and monetization.",
    price: "4.99€",
    image: "assets/products/ai-prompts.png",
    link: "https://goldenboyy.gumroad.com/l/wfoepq"
  },
  {
    name: "Golden Highlight Packs",
    category: "DESIGN / DIGITAL",
    description: "Curated Instagram highlight icon packs for a cleaner, more intentional profile identity. LIMITIED EDITION",
    price: "4.99€",
    image: "assets/products/highlights.png",
    link: "https://goldenboyy.gumroad.com/l/vqoem"
  }
];

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
    const safeCategory = escapeHTML(product.category);
    const safeDescription = escapeHTML(product.description);
    const safePrice = escapeHTML(product.price);
    const link = isUsableLink(product.link)
      ? `<a class="product-link" href="${escapeHTML(product.link)}" target="_blank" rel="noopener noreferrer">View product ↗</a>`
      : `<span class="product-link product-link-disabled" aria-label="Product link not configured">Coming soon</span>`;

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
      img.parentElement.setAttribute("aria-label", `Image unavailable: ${img.alt}`);
    }, { once: true });
  });
}
renderProducts();

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
  toggle?.setAttribute("aria-label", "Open navigation");
}
toggle?.addEventListener("click", () => {
  if (!nav) return;
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
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

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
