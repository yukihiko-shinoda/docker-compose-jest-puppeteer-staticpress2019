export default class PageStaticPressOptions {
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

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click('input[value="Save Changes"]')
    ]);
  }

  private async clearAndType(cssSelector: string, input: string) {
    const elementHandler = await page.$(cssSelector);
    if (elementHandler === null) {
      throw new Error(`Input ${cssSelector} not found.`);
    }
    await elementHandler.click({ clickCount: 3 })
    await elementHandler.type(input);
  }
}
