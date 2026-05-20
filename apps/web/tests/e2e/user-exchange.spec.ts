import { expect, test } from "@playwright/test";
import { loginAsAdmin, loginAsUser } from "./helpers/auth";

const uniqueText = (prefix: string) => `${prefix} ${Math.random().toString(36).slice(2, 10)}`;

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

async function exchangeRewardAsUser(
  page: import("@playwright/test").Page,
  rewardId: string
) {
  await page.getByTestId("user-nav-shop").click();
  await page.getByTestId(`user-reward-item-${rewardId}`).click();
  await expect(page.getByText("Впевнений?")).toBeVisible();
  await page.getByRole("button", { name: "Так!" }).click();
}

test.describe("User direct exchange flow", () => {
  test("user can directly exchange points and balance is updated", async ({ page }) => {
    const rewardName = uniqueText("Exchange Reward");
    const seedDescription = uniqueText("Seed points for exchange");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 2);
    await awardPointsAsAdmin(page, 5, seedDescription);

    await loginAsUser(page);
    // Ensure on "Мій день" screen (default)
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    // Go to shop and exchange
    await page.getByTestId("user-nav-shop").click();
    await exchangeRewardAsUser(page, rewardId);
    // After exchange, check balance on "Мій день"
    await page.getByTestId("user-nav-daily-todo").click();
    await expect(page.getByTestId("user-current-balance")).toBeVisible();
    // Check history
    await page.getByTestId("user-nav-history").click();
    const exchangeHistoryEntry = page
      .locator('[data-testid^="user-history-item-"]')
      .filter({ hasText: `Обмін на: ${rewardName}` })
      .first();
    await expect(exchangeHistoryEntry).toBeVisible();
    await expect(exchangeHistoryEntry).toContainText("-2");
  });

  test("ineligible rewards are disabled when user has insufficient balance", async ({ page }) => {
    const rewardName = uniqueText("Expensive Reward");
    const seedDescription = uniqueText("Seed points for eligibility");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 999999);
    await awardPointsAsAdmin(page, 3, seedDescription);

    await loginAsUser(page);
    await page.getByTestId("user-nav-shop").click();

    const rewardTile = page.getByTestId(`user-reward-item-${rewardId}`);
    await expect(rewardTile).toBeDisabled();

    await rewardTile.click({ force: true });
    await expect(page.getByText("Впевнений?")).toHaveCount(0);
  });

  test("exchange history keeps cost snapshot after reward cost edit", async ({ page }) => {
    const rewardName = uniqueText("Snapshot Reward");
    const seedDescription = uniqueText("Seed points for snapshot");

    await loginAsAdmin(page);
    const rewardId = await createRewardAsAdmin(page, rewardName, 2);
    await awardPointsAsAdmin(page, 4, seedDescription);

    await loginAsUser(page);
    await exchangeRewardAsUser(page, rewardId);

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
    await expect(exchangeHistoryEntry).toContainText("-2");
  });
});
