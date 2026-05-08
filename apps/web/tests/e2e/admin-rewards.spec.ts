import { expect, test } from "@playwright/test";

const uniqueName = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

test.describe("Admin Reward Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("pin-input").fill("1234");
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL("/admin");
  });

  test("should display rewards list page", async ({ page }) => {
    await page.goto("/admin/rewards");
    await expect(page.getByRole("heading", { name: "Нагороди" })).toBeVisible();
  });

  test("should create a new reward", async ({ page }) => {
    const rewardName = uniqueName("Test Reward");

    await page.goto("/admin/rewards");
    await page.getByTestId("create-reward-button").click();

    await expect(page).toHaveURL("/admin/rewards/create");

    await page.getByTestId("reward-name-input").fill(rewardName);
    await page.getByTestId("reward-cost-input").fill("5");
    await page.getByTestId("reward-description-input").fill("Test Description");
    await page.getByTestId("reward-submit-button").click();

    await expect(page).toHaveURL("/admin/rewards");

    const createdRewardCard = page
      .locator('[data-testid^="reward-item-"]')
      .filter({ hasText: rewardName })
      .first();

    await expect(createdRewardCard).toBeVisible();
    await expect(createdRewardCard.getByText("5 очок")).toBeVisible();
  });

  test("should edit an existing reward", async ({ page }) => {
    const rewardName = uniqueName("Editable Reward");

    await page.goto("/admin/rewards");
    await page.getByTestId("create-reward-button").click();
    await expect(page).toHaveURL("/admin/rewards/create");

    await page.getByTestId("reward-name-input").fill(rewardName);
    await page.getByTestId("reward-cost-input").fill("5");
    await page.getByTestId("reward-description-input").fill("Editable reward description");
    await page.getByTestId("reward-submit-button").click();

    await expect(page).toHaveURL("/admin/rewards");

    const rewardCard = page
      .locator('[data-testid^="reward-item-"]')
      .filter({ hasText: rewardName })
      .first();
    await expect(rewardCard).toBeVisible();

    const rewardTestId = await rewardCard.getAttribute("data-testid");
    const rewardId = rewardTestId?.replace("reward-item-", "");
    expect(rewardId).toBeTruthy();

    await page.getByTestId(`edit-reward-button-${rewardId}`).click();
    await expect(page).toHaveURL(`/admin/rewards/${rewardId}/edit`);

    await page.getByTestId("reward-cost-input").fill("10");
    await page.getByTestId("reward-submit-button").click();

    await expect(page).toHaveURL("/admin/rewards");

    const updatedRewardCard = page.getByTestId(`reward-item-${rewardId}`);
    await expect(updatedRewardCard.getByText("10 очок")).toBeVisible();
  });

  test("should deactivate a reward", async ({ page }) => {
    await page.goto("/admin/rewards");

    const firstRewardCard = page.locator('[data-testid^="reward-item-"]').first();
    const rewardTestId = await firstRewardCard.getAttribute("data-testid");
    const rewardId = rewardTestId?.replace("reward-item-", "");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByTestId(`deactivate-reward-button-${rewardId}`).click();

    const rewardCard = page.getByTestId(`reward-item-${rewardId}`);
    await expect(rewardCard.getByText("Неактивна")).toBeVisible();
    await expect(page.getByTestId(`deactivate-reward-button-${rewardId}`)).toHaveCount(0);
  });

  test("should persist reward changes after refresh", async ({ page }) => {
    const rewardName = uniqueName("Persistent Reward");

    await page.goto("/admin/rewards");
    await page.getByTestId("create-reward-button").click();

    await page.getByTestId("reward-name-input").fill(rewardName);
    await page.getByTestId("reward-cost-input").fill("7");
    await page.getByTestId("reward-submit-button").click();

    await expect(page).toHaveURL("/admin/rewards");

    await page.reload();

    const persistedCard = page
      .locator('[data-testid^="reward-item-"]')
      .filter({ hasText: rewardName })
      .first();

    await expect(persistedCard).toBeVisible();
    await expect(persistedCard.getByText("7 очок")).toBeVisible();
  });
});
