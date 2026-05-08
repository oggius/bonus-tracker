import { test, expect } from "@playwright/test";

test.describe("PIN auth and role routing", () => {
  test("anonymous users are redirected to login when opening protected routes", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "BonusTracker" })).toBeVisible();
  });

  test("user PIN lands on user route and cannot access admin route", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("PIN").fill("0000");
    await page.getByRole("button", { name: "Увійти" }).click();

    await expect(page).toHaveURL("/user");
    await expect(page.getByRole("heading", { name: "User Dashboard" })).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL("/user");
  });

  test("admin PIN lands on admin route and cannot access user route", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("PIN").fill("1234");
    await page.getByRole("button", { name: "Увійти" }).click();

    await expect(page).toHaveURL("/admin");
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();

    await page.goto("/user");
    await expect(page).toHaveURL("/admin");
  });

  test("invalid PIN is rejected with an error", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("PIN").fill("9999");
    await page.getByRole("button", { name: "Увійти" }).click();

    await expect(page).toHaveURL("/?error=invalid_pin");
    await expect(page.getByText("Невірний PIN. Спробуйте ще раз.")).toBeVisible();
  });
});
