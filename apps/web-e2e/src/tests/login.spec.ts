import { test, expect } from '@playwright/test';
import { LoginPageObject } from '@poms';

test('login works', async ({ page }) => {
  const loginPage = new LoginPageObject(page);

  await loginPage.goto();
  await loginPage.username.fill(
    process.env['ZERO_CONFIG_AUTH_ADMINEMAIL'] ?? 'admin'
  );
  await loginPage.password.fill(
    process.env['ZERO_CONFIG_AUTH_ADMINPASSWORD'] ?? 'password'
  );
  await loginPage.loginButton.click();

  await expect(page.getByText('Home')).toBeVisible();
});
