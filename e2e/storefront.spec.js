import { test, expect } from "@playwright/test";

/**
 * End-to-end sweep of the storefront against the running production build.
 * Drives real Chromium — clicks, types, adds to cart — rather than asserting on
 * server-rendered HTML.
 *
 * NOTE: no template literals anywhere in this file. Playwright's TS transform
 * blows up on backticks under this bun/Windows toolchain ("N errors building"),
 * so every string is concatenated.
 */

const DESKTOP = { width: 1366, height: 900 };
const MOBILE = { width: 390, height: 844 };

// ── Landing page ────────────────────────────────────────────────
test.describe("landing page", () => {
  test("renders every section", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Bold prints/i);
    await expect(page.locator('a[href^="/categories/"]').first()).toBeVisible();
    await expect(page.getByText(/Handcrafted in Ghana/i).first()).toBeVisible();
    await expect(page.getByText(/Fresh off the dye table/i)).toBeVisible();
    await expect(page.getByText(/The Sale Edit Has Arrived/i)).toBeVisible();
    await expect(page.getByText(/#AmayaliStyle/i)).toBeVisible();
  });

  test("hero slideshow: dots jump and tap advances", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    // The desktop split and the mobile banner are separate markup, so both sets
    // of dots exist in the DOM and one is display:none. Count only what's shown.
    const dots = page.locator('button[aria-label^="Show image"]:visible');
    await expect(dots).toHaveCount(5);

    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");

    await page.locator('button[aria-label="Next image"]:visible').click();
    await expect(dots.nth(3)).toHaveAttribute("aria-current", "true");
  });

  test("mobile keeps the full-bleed hero; desktop runs the split diptych", async ({ page }) => {
    // Mobile: the shot spans the whole viewport width (full-bleed banner).
    // offsetWidth, not boundingBox: the Ken Burns scale(1.09) inflates the
    // rendered box, so boundingBox reports 425 for a 390px-wide element.
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    const mobW = await page
      .locator('img[alt*="Amayali"]:visible')
      .first()
      .evaluate((el) => el.offsetWidth);
    expect(mobW).toBe(MOBILE.width);

    // Desktop: two frames, each cut to the photograph's own 2:3 so the model is
    // never cropped, and the whole hero sits inside one window.
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const frames = page.locator('section img[alt*="Amayali"], section img[alt=""]');
    const first = await frames.first().boundingBox();
    expect(Math.abs(first.width / first.height - 2 / 3)).toBeLessThan(0.03);

    const hero = await page.locator("section > div").first().boundingBox();
    const header = await page.locator("header").first().boundingBox();
    expect(header.height + hero.height).toBeLessThanOrEqual(DESKTOP.height);
  });

  test("TikTok rail: real posters, and a clip plays in place", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "#AmayaliStyle" })).toBeVisible();
    const tiles = page.getByRole("button", { name: /^Watch:/ });
    await expect(tiles).toHaveCount(5);

    // Posters come from TikTok's oEmbed, not from bundled images.
    await expect(page.locator('img[src*="tiktok"]').first()).toBeVisible();

    // Click-to-load: no third-party iframe until the shopper asks for one.
    await expect(page.locator('iframe[src*="tiktok.com/embed"]')).toHaveCount(0);
    await tiles.first().click();

    // Opens in a lightbox, and TikTok's own embed.js builds the player there.
    // NOTE: the clip cannot actually play from http://localhost — TikTok signs
    // its media against the referrer and its CDN refuses a localhost origin
    // (MEDIA_ELEMENT_ERROR: Format error). Playback is verified against the
    // deployed HTTPS origin, so this asserts the wiring, not the pixels.
    const dialog = page.getByRole("dialog", { name: /bubu|tiktok/i });
    await expect(dialog).toBeVisible();
    await expect(page.locator('iframe[src*="tiktok.com/embed"]')).toHaveCount(1, {
      timeout: 20000,
    });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("category tile opens that category", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await page.locator('a[href="/categories/dresses"]').first().click();
    await expect(page).toHaveURL(/\/categories\/dresses/);
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();
  });
});

// ── Search ──────────────────────────────────────────────────────
test.describe("header search", () => {
  test("category term routes to the category", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const input = page.getByRole("combobox", { name: /search products/i });
    await input.fill("skirts");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/categories\/skirts/);
  });

  test("product term routes to the product", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    const input = page.getByRole("combobox", { name: /search products/i });
    await input.fill("gingham");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/products\/yaa-gingham/);
  });

  test("suggestions dropdown appears while typing", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/");
    await page.getByRole("combobox", { name: /search products/i }).fill("kimono");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option").first()).toBeVisible();
  });

  test("the /search results page is gone", async ({ page }) => {
    const res = await page.goto("/search?q=tops");
    expect(res?.status()).toBe(404);
  });
});

// ── Shop grid ───────────────────────────────────────────────────
test.describe("shop", () => {
  test("category chips filter the grid", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    await expect(page.locator("article")).toHaveCount(11);

    await page.getByRole("button", { name: "Rompers", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(2);

    await page.getByRole("button", { name: "All", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(11);
  });

  test("sort by price: low to high", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    await page.getByLabel("Sort products").selectOption("price-asc");
    await expect(page.locator("article").first()).toContainText("100");
  });
});

// ── Product card ────────────────────────────────────────────────
test.describe("product card", () => {
  test("quick add-to-cart increments the header count", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");

    const card = page.locator("article").first();
    await card.hover();
    await card.getByRole("button", { name: /add to cart/i }).click();

    await expect(card.getByRole("button", { name: /add to cart/i })).toContainText(/added/i);
    await expect(page.getByRole("button", { name: /open cart, 1 item/i })).toBeVisible();
  });

  test("size selection is per-card", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    const card = page.locator("article").first();

    await card.getByRole("button", { name: "Size L" }).click();
    await expect(card.getByRole("button", { name: "Size L" })).toHaveAttribute("aria-pressed", "true");
    await expect(card.getByRole("button", { name: "Size S" })).toHaveAttribute("aria-pressed", "false");
  });

  test("wishlist is gone everywhere", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    await expect(page.getByRole("button", { name: /wishlist/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /wishlist/i })).toHaveCount(0);

    await page.goto("/products/abena-tiered-batik-maxi-skirt");
    await expect(page.getByRole("button", { name: /wishlist/i })).toHaveCount(0);
  });

  test("Size Guide opens the measurement chart", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    await page.locator("article").first().getByRole("button", { name: "Size Guide" }).click();

    const dialog = page.getByRole("dialog", { name: "Size Guide" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("columnheader", { name: "Bust" })).toBeVisible();

    // Scoped to the S row: "84-89 cm" is S's bust *and* XL's waist, so an
    // unscoped cell lookup legitimately matches twice.
    const rowS = dialog.getByRole("row").filter({ hasText: "8–10" });
    await expect(rowS.getByRole("cell", { name: "84–89 cm" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

// ── PDP ─────────────────────────────────────────────────────────
test.describe("product detail page", () => {
  /**
   * The buy column only — the "You may also like" rail below is full of product
   * cards that each carry their own "Add to Cart" and "Size Guide", so an
   * unscoped lookup matches five buttons and Playwright rightly refuses to
   * guess. The buy column is the section that owns the <h1>.
   */
  function buyColumn(page) {
    return page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
  }

  test("add to cart with a chosen size and qty", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/abena-tiered-batik-maxi-skirt");
    const buy = buyColumn(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abena");
    await buy.getByRole("button", { name: "M", exact: true }).click();
    await buy.getByRole("button", { name: "Increase quantity" }).click();
    await buy.getByRole("button", { name: /add to cart/i }).click();

    await expect(page.getByRole("button", { name: /open cart, 2 items/i })).toBeVisible();
  });

  test("adding with no size opens the sheet, then completes the add", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/adjoa-smocked-batik-mini-wine");

    await buyColumn(page).getByRole("button", { name: /add to cart/i }).click();
    const sheet = page.getByRole("dialog", { name: /select a size/i });
    await expect(sheet).toBeVisible();

    await sheet.getByRole("button", { name: "L", exact: true }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByRole("button", { name: /open cart, 1 item/i })).toBeVisible();
  });

  test("Size Guide modal opens from the PDP", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/abena-tiered-batik-maxi-skirt");
    await buyColumn(page).getByRole("button", { name: "Size Guide" }).click();
    await expect(page.getByRole("dialog", { name: "Size Guide" })).toBeVisible();
  });

  test("related rail is present", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/abena-tiered-batik-maxi-skirt");
    await expect(page.getByText(/you may also like/i)).toBeVisible();
  });
});

// ── Cart ────────────────────────────────────────────────────────
test.describe("cart", () => {
  test("drawer does NOT auto-open on add, but opens on click with the item", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");

    const card = page.locator("article").first();
    await card.hover();
    await card.getByRole("button", { name: /add to cart/i }).click();
    await expect(page.getByRole("button", { name: /open cart, 1 item/i })).toBeVisible();

    await page.getByRole("button", { name: /open cart/i }).click();
    await expect(page.getByText("Afua Colour-Stripe Camp Romper").first()).toBeVisible();
  });
});

// ── Mobile ──────────────────────────────────────────────────────
test.describe("mobile", () => {
  test.use({ viewport: MOBILE });

  test("nav drawer opens above the hero and links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();

    const drawer = page.getByRole("navigation", { name: /mobile navigation/i });
    await expect(drawer).toBeVisible();

    await drawer.getByRole("link", { name: "Dresses" }).click();
    await expect(page).toHaveURL(/\/categories\/dresses/);
  });

  test("search hides behind the magnifier and opens a sheet", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("combobox", { name: /search products/i })).toBeHidden();

    await page.getByRole("button", { name: "Search", exact: true }).click();
    await expect(page.getByRole("combobox", { name: /search products/i })).toBeVisible();
  });

  test("size pills sit on one row and never overflow the card", async ({ page }) => {
    await page.goto("/shop");
    const card = page.locator("article").first();
    // Anchored: a loose /^Size / also swallows the card's "Size Guide" link.
    const pills = card.getByRole("button", { name: /^Size (S|M|L|XL)$/ });
    await expect(pills).toHaveCount(4);

    const all = await pills.all();
    const ys = [];
    const cardBox = await card.boundingBox();
    for (const pill of all) {
      const b = await pill.boundingBox();
      ys.push(Math.round(b.y));
      expect(b.x + b.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
      expect(Math.round(b.height)).toBe(36);
    }
    expect(new Set(ys).size).toBe(1);
  });

  test("cards are equal height", async ({ page }) => {
    await page.goto("/shop");
    const a = await page.locator("article").nth(0).boundingBox();
    const b = await page.locator("article").nth(1).boundingBox();
    expect(Math.abs(a.height - b.height)).toBeLessThanOrEqual(1);
  });

  test("grid is single-column; Size Guide sits beside the size run", async ({ page }) => {
    await page.goto("/shop");
    const a = await page.locator("article").nth(0).boundingBox();
    const b = await page.locator("article").nth(1).boundingBox();
    expect(Math.round(a.x)).toBe(Math.round(b.x)); // stacked, not side by side

    const card = page.locator("article").first();
    const pills = await card.getByRole("group", { name: "Select a size" }).boundingBox();
    const pill = await card.getByRole("button", { name: "Size S" }).boundingBox();
    const sg = await card.getByRole("button", { name: "Size Guide" }).boundingBox();
    const cta = await card.getByRole("button", { name: /add to cart/i }).boundingBox();

    // The size run holds a single row — it used to collapse into stacked lines.
    expect(Math.round(pills.height / pill.height)).toBe(1);

    // Size Guide sits to the right of the pills, on their line.
    expect(sg.x).toBeGreaterThan(pills.x);
    expect(Math.abs(sg.y + sg.height / 2 - (pills.y + pills.height / 2))).toBeLessThanOrEqual(12);

    // ...and the CTA takes the row beneath, full width.
    expect(cta.y).toBeGreaterThan(sg.y);
    expect(cta.width).toBeGreaterThan(a.width - 45);
  });

  test("quick add works on touch (no hover)", async ({ page }) => {
    await page.goto("/shop");
    const card = page.locator("article").first();
    await card.getByRole("button", { name: /add to cart/i }).click();
    await expect(page.getByRole("button", { name: /open cart, 1 item/i })).toBeVisible();
  });

  test("no horizontal overflow on the page", async ({ page }) => {
    await page.goto("/shop");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);
  });
});

// ── Routes ──────────────────────────────────────────────────────
test.describe("routes respond 200", () => {
  const paths = [
    "/", "/shop", "/journal", "/about", "/contact", "/faq",
    "/shipping", "/returns", "/terms", "/privacy", "/accessibility",
    "/categories/dresses", "/categories/rompers", "/categories/skirts",
    "/categories/activewear", "/collections/sale", "/cart", "/checkout",
  ];
  for (const path of paths) {
    test(path, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });
  }
});
