import type { Page } from '@playwright/test';

export abstract class BasePom {
  public constructor(
    protected readonly page: Page,
    private readonly path: string
  ) {}

  public async goto() {
    await this.page.goto(this.path);
  }
}
