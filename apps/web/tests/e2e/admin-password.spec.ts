import { expect, test } from "@playwright/test";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@bonus-tracker/db";

import {
  ADMIN_DEFAULT_PASSWORD,
  ADMIN_UPDATED_PASSWORD,
  USER_UPDATED_PASSWORD,
} from "./helpers/auth";

const prisma = new PrismaClient();

async function resetSeedCredentials() {
  const adminPasswordHash = await bcrypt.hash(ADMIN_DEFAULT_PASSWORD, 10);
  const userPasswordHash = await bcrypt.hash("0000", 10);

  await prisma.user.update({
    where: { id: "seed-admin" },
    data: {
      passwordHash: adminPasswordHash,
      mustChangePassword: true,
    },
  });

  await prisma.user.update({
    where: { id: "seed-user" },
    data: {
      passwordHash: userPasswordHash,
      mustChangePassword: false,
    },
  });
}

test.describe("Admin password management", () => {
  test.beforeEach(async () => {
    await resetSeedCredentials();
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test("admin is forced to rotate default password on first login", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("login-button").click();

    await expect(page).toHaveURL("/admin/settings");
    await expect(page.getByText("Для безпеки потрібно змінити стандартний пароль адміністратора.")).toBeVisible();

    await page.getByTestId("admin-current-password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("admin-new-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-confirm-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-password-submit-button").click();

    await expect(page).toHaveURL("/admin");
  });

  async function rotateAdminPassword(page: import("@playwright/test").Page) {
    await page.goto("/");
    await page.getByTestId("password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL("/admin/settings");

    await page.getByTestId("admin-current-password-input").fill(ADMIN_DEFAULT_PASSWORD);
    await page.getByTestId("admin-new-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-confirm-password-input").fill(ADMIN_UPDATED_PASSWORD);
    await page.getByTestId("admin-password-submit-button").click();

    await expect(page).toHaveURL("/admin");
  }

  test("admin can set user password and user can log in with new password", async ({ page }) => {
    await rotateAdminPassword(page);

    await page.goto("/admin/settings");
    await page.getByTestId("user-new-password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("user-confirm-password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("user-password-submit-button").click();

    await page.context().clearCookies();
    await page.goto("/");
    await page.getByTestId("password-input").fill(USER_UPDATED_PASSWORD);
    await page.getByTestId("login-button").click();
    await expect(page).toHaveURL("/user");

  });
});
