import { expect, test, type Page } from "@playwright/test";

async function expectWelcomeParade(page: Page) {
  const opening = page.locator('dialog[data-testid="intro-loader"][open]');
  await expect(opening.getByText("WELCOME !", { exact: true })).toBeVisible();
  await expect(opening).toBeHidden({ timeout: 5000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test("the welcome parade plays and closes on both a first visit and a reload", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "commit" });
  await expectWelcomeParade(page);
  await page.reload({ waitUntil: "commit" });
  await expectWelcomeParade(page);
});

test("reduced motion keeps the opening closed through hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    document.addEventListener("beforetoggle", (event) => {
      if (event instanceof ToggleEvent && event.newState === "open" &&
          event.target instanceof HTMLDialogElement && event.target.dataset.testid === "intro-loader") {
        document.documentElement.dataset.openingObserved = "true";
      }
    }, true);
  });
  await page.goto("/");
  // Opening the menu confirms the client is interactive before checking for a brief overlay.
  await page.getByRole("button", { name: "メニューを開く" }).click();
  await expect(page.getByRole("dialog", { name: "メニュー", exact: true })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-opening-observed", "true");
});

test.describe("home without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "no-preference" });

  test("the hero shows its endorsement below the wordmark and the footer keeps its disclaimer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("intro-loader")).toBeHidden();
    const hero = page.getByRole("main");
    const title = hero.getByRole("heading", { name: "KYOU POKE", exact: true });
    const endorsement = hero.getByText("公認ファンサイト", { exact: true });
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(title).toBeVisible();
      await expect(endorsement).toBeVisible();
      await expect(endorsement).toHaveCSS("color", "rgb(0, 0, 0)");
      const titleBox = await title.boundingBox();
      const endorsementBox = await endorsement.boundingBox();
      expect(endorsementBox!.y).toBeGreaterThanOrEqual(titleBox!.y + titleBox!.height - 1);
      expect(endorsementBox!.y - (titleBox!.y + titleBox!.height)).toBeLessThan(8);
    }
    await expect(page.locator("footer")).toContainText("非公式");
  });
});
