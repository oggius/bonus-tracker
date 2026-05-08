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

async function createRewardAsAdmin(
  page: import("@playwright/test").Page,
  name: string,
  cost: number
) {
  await page.goto("/admin/rewards");
  await page.getByTestId("create-reward-button").click();
  await expect(page).toHaveURL("/admin/rewards/create");

  await page.getByTestId("reward-name-input").fill(name);
  await page.getByTestId("reward-cost-input").fill(String(cost));
  await page.getByTestId("reward-description-input").fill("E2E exchange reward");
  await page.getByTestId("reward-submit-button").click();
  await expect(page).toHaveURL("/admin/rewards");

  const rewardCard = page
    .locator('[data-testid^="reward-item-"]')
    .filter({ hasText: name })
    .first();

  await expect(rewardCard).toBeVisible();

  const rewardTestId = await rewardCard.getAttribute("data-testid");
  return rewardTestId?.replace("reward-item-", "") ?? "";
}

async function awardPointsAsAdmin(
  page: import("@playwright/test").Page,
  amount: number,
  description: string
) {
  await page.goto("/admin/points");
  await page.getByTestId("points-action-select").selectOption("award");
  await page.getByTestId("points-amount-input").fill(String(amount));
  await page.getByTestId("points-description-input").fill(description);
  await page.getByTestId("points-submit-button").click();
  await expect(
    page.locator('[data-testid^="points-log-"]').filter({ hasText: description }).first()
  ).toBeVisible();
}

test.describe("User direct exchange flow", () => {
  test("user can directly exchange points and balance is updated", async ({ page }) => {
    const rewardName = uniqueText("Exchange Reward");
    const seedDescription = uniqueText("Seed points for exchange");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 2);
    await awardPointsAsAdmin(page, 5, seedDescription);

    await loginAsUser(page);
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    await page.getByTestId("user-nav-shop").click();

    await page.getByTestId(`exchange-submit-button-${rewardId}`).click();
    await page.getByTestId("user-nav-history").click();

    const exchangeHistoryEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: `Обмін на: ${rewardName}` })
      .first();

    await expect(exchangeHistoryEntry).toBeVisible();
    await expect(exchangeHistoryEntry.getByText("-2 очок")).toBeVisible();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
  });

  test("user can edit exchange comment and it persists after refresh", async ({ page }) => {
    const rewardName = uniqueText("Comment Reward");
    const seedDescription = uniqueText("Seed points for comment");
    const updatedComment = uniqueText("Updated exchange comment");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 1);
    await awardPointsAsAdmin(page, 3, seedDescription);

    await loginAsUser(page);
    await page.getByTestId("user-nav-shop").click();
    await page.getByTestId(`exchange-submit-button-${rewardId}`).click();

    const exchangeCard = page
      .locator('[data-testid^="user-exchange-item-"]')
      .filter({ hasText: rewardName })
      .first();

    await expect(exchangeCard).toBeVisible();

    const commentInput = exchangeCard.locator('input[name="comment"]');
    await commentInput.fill(updatedComment);
    await exchangeCard.getByRole("button", { name: "Зберегти коментар" }).click();

    await page.getByTestId("user-nav-history").click();
    const historyWithComment = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: updatedComment })
      .first();

    await expect(historyWithComment).toBeVisible();

    await page.reload();

    const persistedHistoryWithComment = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: updatedComment })
      .first();

    await expect(persistedHistoryWithComment).toContainText(updatedComment);
  });

  test("exchange history keeps cost snapshot after reward cost edit", async ({ page }) => {
    const rewardName = uniqueText("Snapshot Reward");
    const seedDescription = uniqueText("Seed points for snapshot");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 2);
    await awardPointsAsAdmin(page, 4, seedDescription);

    await loginAsUser(page);
    await page.getByTestId(`exchange-submit-button-${rewardId}`).click();

    await loginAsAdmin(page);
    await page.goto(`/admin/rewards/${rewardId}/edit`);
    await page.getByTestId("reward-cost-input").fill("9");
    await page.getByTestId("reward-submit-button").click();
    await expect(page).toHaveURL("/admin/rewards");

    await loginAsUser(page);
    await page.getByTestId("user-nav-history").click();

    const exchangeHistoryEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: `Обмін на: ${rewardName}` })
      .first();

    await expect(exchangeHistoryEntry).toBeVisible();
    await expect(exchangeHistoryEntry.getByText("-2 очок")).toBeVisible();
  });
});
