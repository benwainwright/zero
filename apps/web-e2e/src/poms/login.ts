import { BasePom } from '@helpers';
import type { Page } from '@playwright/test';

export class LoginPageObject extends BasePom {
  public constructor(page: Page) {
    super(page, '/login');
  }

  public get username() {
    return this.page.getByLabel('Username');
  }

  public get password() {
    return this.page.getByLabel('Password');
  }

  public get loginButton() {
    return this.page.getByText('Login');
  }

  public get registerLink() {
    return this.page.getByText('Register');
  }
}
