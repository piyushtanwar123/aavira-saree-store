import { test, expect } from "@playwright/test";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";

test("desktop homepage and collection navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Timeless Sarees, Everyday Elegance." })).toBeVisible();
  await expect(page.locator(".category-card")).toHaveCount(6);
  await expect(page.locator(".product-card")).toHaveCount(8);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "/tmp/aavira-desktop.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator(".category-card").filter({ hasText: "Kanjivaram" }).click();
  await expect(page.getByRole("heading", { name: "Kanjivaram Sarees" })).toBeVisible();
  await expect(page.locator(".product-card")).toHaveCount(2);
  expect(errors).toEqual([]);
});

test("shopping bag persists quantities and submits a real enquiry", async ({ page }) => {
  await page.goto(`${base}/products/gulab-rose-banarasi-silk`);
  await page.getByRole("button", { name: "View fabric detail" }).click();
  await expect(page.locator(".detail-main-image")).toHaveClass(/fabric-view/);
  await page.getByRole("button", { name: "Increase quantity" }).click();
  await page.getByRole("button", { name: "Add to shopping bag" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".cart-drawer .quantity-control>span")).toHaveText("2");
  await page.getByRole("link", { name: "View shopping bag" }).click();
  await expect(page).toHaveURL(`${base}/cart`);
  await expect(page.locator(".shopping-bag-content .quantity-control>span")).toHaveText("2");
  await page.reload();
  await expect(page.locator(".shopping-bag-content .quantity-control>span")).toHaveText("2");
  await expect(page.locator(".order-summary .total")).toContainText("₹6,998");
  await page.getByRole("button", { name: "Enquire to order", exact: true }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Browser Test");
  await page.getByLabel("Email address", { exact: true }).fill("browser-test@example.com");
  await page.getByRole("button", { name: "Send an enquiry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your enquiry is saved." })).toBeVisible();
  await page.getByRole("button", { name: "Continue exploring", exact: true }).click();
  await page.getByRole("button", { name: "Remove Gulab Rose Banarasi Silk", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A little room for elegance." })).toBeVisible();
});

test("search, favourites, filtering and price sorting", async ({ page }) => {
  await page.goto(base);
  await page.getByRole("button", { name: "Search sarees", exact: true }).click();
  await page.getByRole("textbox", { name: "Search sarees", exact: true }).fill("emerald");
  await expect(page.locator(".search-results>a")).toHaveCount(1);
  await page.locator(".search-results>a").click();
  await expect(page.getByRole("heading", { name: "Meera Emerald Kanjivaram", exact: true })).toBeVisible();
  await page.locator(".detail-main-image").getByRole("button", { name: "Save to favourites", exact: true }).click();
  await page.goto(`${base}/wishlist`);
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-name")).toHaveText("Meera Emerald Kanjivaram");
  await page.goto(`${base}/shop`);
  await page.getByRole("combobox", { name: "Sort sarees" }).selectOption("price-low");
  await expect(page.locator(".product-name").first()).toHaveText("Noor Lilac Organza");
  await page.getByRole("button", { name: "Bridal", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(2);
});

test("mobile layout and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: "/tmp/aavira-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Shop", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Find your kind of timeless." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator(".quick-add").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".cart-drawer .cart-line")).toHaveCount(1);
  await page.getByRole("button", { name: "Close shopping bag", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
