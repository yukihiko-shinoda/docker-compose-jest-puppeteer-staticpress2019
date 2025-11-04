import { Page } from "@playwright/test";

export default class PageStaticPressOptions {
  constructor(private page: Page) {}

  public async setOptions(
    staticUrl: string,
    dumpDirectory: string,
    basicAuthenticationUser: string,
    basicAuthenticationPassword: string,
    requestTimeout: string) {
    await this.clearAndType('input[id="static_url"]', staticUrl);
    await this.clearAndType('input[id="static_dir"]', dumpDirectory);
    await this.clearAndType('input[id="basic_usr"]', basicAuthenticationUser);
    await this.clearAndType('input[id="basic_pwd"]', basicAuthenticationPassword);
    await this.clearAndType('input[id="timeout"]', requestTimeout);

    await this.page.click('input[value="Save Changes"]');
    await this.page.waitForLoadState('domcontentloaded');
  }

  private async clearAndType(cssSelector: string, input: string) {
    const elementHandler = this.page.locator(cssSelector);
    await elementHandler.click({ clickCount: 3 });
    await elementHandler.fill(input);
  }
}
