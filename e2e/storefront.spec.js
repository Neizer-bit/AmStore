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

    const dots = page.locator('button[aria-label^="Show image"]');
    await expect(dots).toHaveCount(5);

    await dots.nth(2).click();
    await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");

    await page.getByRole("button", { name: "Next image" }).click();
    await expect(dots.nth(3)).toHaveAttribute("aria-current", "true");
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

  test("size selection is per-card; wishlist toggles", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    const card = page.locator("article").first();

    await card.getByRole("button", { name: "Size L" }).click();
    await expect(card.getByRole("button", { name: "Size L" })).toHaveAttribute("aria-pressed", "true");
    await expect(card.getByRole("button", { name: "Size S" })).toHaveAttribute("aria-pressed", "false");

    await card.getByRole("button", { name: /add .* to wishlist/i }).click();
    await expect(card.getByRole("button", { name: /remove .* from wishlist/i })).toBeVisible();
  });

  test("Size Guide opens the measurement chart", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/shop");
    await page.locator("article").first().getByRole("button", { name: "Size Guide" }).click();

    const dialog = page.getByRole("dialog", { name: "Size Guide" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("columnheader", { name: "Bust" })).toBeVisible();
    await expect(dialog.getByRole("cell", { name: "84–89 cm" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

// ── PDP ─────────────────────────────────────────────────────────
test.describe("product detail page", () => {
  test("add to cart with a chosen size and qty", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/abena-tiered-batik-maxi-skirt");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Abena");
    await page.getByRole("button", { name: "M", exact: true }).click();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByRole("button", { name: /add to cart/i }).click();

    await expect(page.getByRole("button", { name: /open cart, 2 items/i })).toBeVisible();
  });

  test("adding with no size opens the sheet, then completes the add", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/adjoa-smocked-batik-mini-wine");

    await page.getByRole("button", { name: /add to cart/i }).click();
    const sheet = page.getByRole("dialog", { name: /select a size/i });
    await expect(sheet).toBeVisible();

    await sheet.getByRole("button", { name: "L", exact: true }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByRole("button", { name: /open cart, 1 item/i })).toBeVisible();
  });

  test("Size Guide modal opens from the PDP", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/products/abena-tiered-batik-maxi-skirt");
    await page.getByRole("button", { name: "Size Guide" }).click();
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
    const pills = card.getByRole("button", { name: /^Size / });
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

  test("cards in a row are equal height", async ({ page }) => {
    await page.goto("/shop");
    const a = await page.locator("article").nth(0).boundingBox();
    const b = await page.locator("article").nth(1).boundingBox();
    expect(Math.abs(a.height - b.height)).toBeLessThanOrEqual(1);
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
