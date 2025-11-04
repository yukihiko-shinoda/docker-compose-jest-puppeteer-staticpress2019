import RoutineOperation from "../RoutineOperation";
import { Page, Locator } from "@playwright/test";

export default class PageAdmin {
  constructor(private page: Page) {}

  public async hoverMenu(menu: string): Promise<void> {
    const linkHandlerMenu = this.getLinkHandlerMenu(menu);
    // Playwright's hover() already waits for the element to be actionable
    await linkHandlerMenu.hover();
  }

  public async clickMenu(menu: string): Promise<void> {
    const linkHandler = this.getLinkHandlerMenu(menu);
    await linkHandler.click();
    await this.page.waitForLoadState('networkidle');
  }

  public async waitForSubMenu(subMenu: string): Promise<void> {
    const linkHandler = this.getLinkHandlerSubMenu(subMenu);
    await linkHandler.waitFor({ state: 'visible' });
  }

  public async clickSubMenu(subMenu: string): Promise<void> {
    const linkHandler = this.getLinkHandlerSubMenu(subMenu);
    await linkHandler.click();
    await this.page.waitForLoadState('networkidle');
  }

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  private getLinkHandlerMenu(menu: string): Locator {
    const escapedMenu = RoutineOperation.escapeXpathString(menu);
    return this.getLinkHandler(`//div[@class="wp-menu-name" and contains(text(), ${escapedMenu})]`);
  }

  private getLinkHandlerSubMenu(subMenu: string): Locator {
    const escapedSubMenu = RoutineOperation.escapeXpathString(subMenu);
    return this.getLinkHandler(`//a[text()=${escapedSubMenu}]`);
  }

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  private getLinkHandler(xpath: string): Locator {
    return this.page.locator(`xpath=.${xpath}`).first();
  }
}
