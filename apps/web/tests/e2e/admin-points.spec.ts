import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

test.describe("Admin points management", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test("awards points and writes history entry", async ({ page }) => {
    const description = uniqueText("Award e2e");

    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("3");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();

    const entry = page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first();
    await expect(entry).toBeVisible();
    await expect(entry.getByText("+3 очок")).toBeVisible();
  });

  test("deducts points and persists history after refresh", async ({ page }) => {
    const awardDescription = uniqueText("Deduct prep award");
    const deductDescription = uniqueText("Deduct e2e");

    await page.goto("/admin/points");

    await page.getByTestId("points-action-select").selectOption("award");
    await page.getByTestId("points-amount-input").fill("7");
    await page.getByTestId("points-description-input").fill(awardDescription);
    await page.getByTestId("points-submit-button").click();

    await page.getByTestId("points-action-select").selectOption("deduct");
    await page.getByTestId("points-amount-input").fill("4");
    await page.getByTestId("points-description-input").fill(deductDescription);
    await page.getByTestId("points-submit-button").click();

    const deductEntry = page.locator('[data-testid^="points-log-"]').filter({ hasText: deductDescription }).first();
    await expect(deductEntry).toBeVisible();
    await expect(deductEntry.getByText("-4 очок")).toBeVisible();

    await page.reload();

    const persistedEntry = page.locator('[data-testid^="points-log-"]').filter({ hasText: deductDescription }).first();
    await expect(persistedEntry).toBeVisible();
    await expect(persistedEntry.getByText("-4 очок")).toBeVisible();
  });

  test("blocks invalid deduction", async ({ page }) => {
    const description = uniqueText("Invalid deduct");

    await page.goto("/admin/points");
    await page.getByTestId("points-action-select").selectOption("deduct");
    await page.getByTestId("points-amount-input").fill("999999");
    await page.getByTestId("points-description-input").fill(description);
    await page.getByTestId("points-submit-button").click();

    await expect(page.getByText("Недостатньо очок для списання")).toBeVisible();
  });
});
