import { expect, test } from "@playwright/test";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.context().clearCookies();
  await page.goto("/");
  await page.getByTestId("pin-input").fill("1234");
  await page.getByTestId("login-button").click();
  await expect(page).toHaveURL("/admin");
}

async function loginAsUser(page: import("@playwright/test").Page) {
  await page.context().clearCookies();
  await page.goto("/");
  await page.getByTestId("pin-input").fill("0000");
  await page.getByTestId("login-button").click();
  await expect(page).toHaveURL("/user");
}

test.describe("User balance and history", () => {
  test("shows current balance and history from server data", async ({ page }) => {
    const description = uniqueText("User history entry");

    await loginAsAdmin(page);
    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("5");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();
    await expect(
      page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first()
    ).toBeVisible();

    await loginAsUser(page);
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();

    const historyEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await expect(historyEntry).toBeVisible();
    await expect(historyEntry).toContainText("+5");
  });

  test("keeps balance and history after refresh", async ({ page }) => {
    const description = uniqueText("User persist entry");

    await loginAsAdmin(page);
    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("3");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();
    await expect(
      page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first()
    ).toBeVisible();

    await loginAsUser(page);
    await page.getByTestId("user-nav-history").click();

    const historyEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await page.getByTestId("user-nav-balance").click();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();
    await expect(historyEntry).toBeVisible();

    await page.reload();

    const persistedEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: description })
      .first();

    await page.getByTestId("user-nav-balance").click();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-history").click();
    await expect(persistedEntry).toBeVisible();
  });
});
