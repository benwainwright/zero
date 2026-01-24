import { test, expect } from '@playwright/test';
import { LoginPageObject } from '@poms';

test('When I enter the admin username and password and press login I am taken to the home page', async ({
  page,
}) => {
  const loginPage = new LoginPageObject(page);

  await loginPage.goto();
  await loginPage.username.fill('admin');

  await loginPage.password.fill(
    process.env['ZERO_CONFIG_AUTH_ADMINPASSWORD'] ?? 'password'
  );
  await loginPage.loginButton.click();

  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
});
