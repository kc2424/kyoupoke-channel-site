import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
}

async function expectFocusInside(page: Page, selector: string) {
  await expect.poll(() => page.evaluate((value) => {
    const container = document.querySelector(value);
    return Boolean(container?.contains(document.activeElement));
  }, selector)).toBe(true);
}

test("home and news render their main content without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const path of ["/", "/news"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("footer")).toContainText("非公式");
    await expectNoHorizontalOverflow(page);
  }
  expect(errors).toEqual([]);
});

test("unknown pages return an accessible 404 with a way home", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("main").locator('a[href="/"]').first()).toBeVisible();
});

test("server-rendered content remains readable with JavaScript disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of ["profile", "members", "achievements", "videos", "contact"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      expect(await section.innerText()).not.toBe("");
      // Visibility assertions alone do not catch an opacity:0 ancestor.
      expect(await section.evaluate((element) => {
        for (let current: Element | null = element; current; current = current.parentElement) {
          if (Number(getComputedStyle(current).opacity) === 0) return false;
        }
        return true;
      })).toBe(true);
    }
    await page.goto("/news");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  } finally {
    await context.close();
  }
});

test("mobile menu traps focus, locks scrolling and restores its trigger", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "メニューを開く" });
  await expect(page.getByRole("dialog", { name: "メニュー" })).toBeHidden();
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "メニュー", exact: true });
  await expect(menu).toBeVisible();
  await expectFocusInside(page, "dialog[open]");
  const scrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrollY);
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    await expectFocusInside(page, "dialog[open]");
  }
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog:not([open]), [aria-hidden="true"]')))).toBe(false);
  }
});

test("menu section links update the hash and focus the destination", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "メニューを開く" }).click();
  await page.getByRole("dialog", { name: "メニュー", exact: true }).locator('a[href="#members"]').click();
  await expect(page).toHaveURL(/#members$/);
  await expect(page.locator("#members")).toBeFocused();
});

test("video close control stays in view in phone landscape and focus returns", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  // Verify our embed URL and controls independently of YouTube playback availability.
  await page.route(/https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//, (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><title>Video</title>" }));
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /を再生$/ }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: /Close|閉じる/ });
  await expect(close).toBeFocused();
  await expect(close).toBeInViewport({ ratio: 1 });
  await expect(dialog.locator("iframe")).toHaveAttribute("src", /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\?/);
  await close.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("iframe")).toHaveCount(0);
});

for (const width of [390, 1024, 1440]) {
  test(`header fits and navigation is available at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expectNoHorizontalOverflow(page);
    const header = page.locator("header");
    const visibleControls = header.locator("a:visible, button:visible");
    for (const control of await visibleControls.all()) await expect(control).toBeInViewport({ ratio: 1 });
    if (width <= 1024) await expect(header.getByRole("button", { name: "メニューを開く" })).toBeVisible();
    else {
      // The closed menu also contains a nav. Select the exposed navigation landmark.
      const navigation = header.getByRole("navigation");
      await expect(navigation).toHaveCount(1);
      await expect(navigation).toBeVisible();
    }
  });
}

test("unconfigured contact does not offer to send to a placeholder", async ({ page }) => {
  await page.goto("/#contact");
  const contact = page.locator("#contact");
  await expect(contact).toContainText(/準備中|受付.*停止|未設定/);
  await expect(contact.locator('a[href^="mailto:"]')).toHaveCount(0);
  for (const button of await contact.locator('button[type="submit"]').all()) await expect(button).toBeDisabled();
});

test("initial image and font preload budgets stay bounded", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const imagePreloads = page.locator('link[rel="preload"][as="image"]');
  expect(await imagePreloads.count()).toBeLessThanOrEqual(2);
  expect(await page.locator('link[rel="preload"][as="font"]').count()).toBeLessThanOrEqual(2);
  await expect(page.locator('link[rel="preload"][href*="hero-mascots"], link[rel="preload"][imagesrcset*="hero-mascots"]')).toHaveCount(0);
  const hero = page.locator("main img:visible").first();
  await expect(hero).toBeVisible();
  await expect.poll(() => hero.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const oversized = await page.locator("img:visible").evaluateAll((images) => images.filter((node) => {
    const image = node as HTMLImageElement;
    const width = image.getBoundingClientRect().width;
    return width > 100 && image.complete && image.naturalWidth > Math.max(960, width * 3);
  }).map((image) => image.getAttribute("alt")));
  expect(oversized).toEqual([]);
});

test("response headers distinguish production and search-excluded preview", async ({ request }, testInfo) => {
  for (const path of ["/", "/news"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-frame-options"]).toBe("DENY");
    if (testInfo.project.name === "cloudflare") expect(response.headers()["x-robots-tag"]).toContain("noindex");
    else expect(response.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
  }
});
