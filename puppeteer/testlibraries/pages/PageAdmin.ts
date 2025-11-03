import RoutineOperation from "../RoutineOperation";
import { ElementHandle } from "puppeteer";

export default class PageAdmin {
  public async hoverMenu(menu: string): Promise<void> {
    const linkHandlerMenu = await PageAdmin.getLinkHandlerMenu(menu);
    await linkHandlerMenu.hover();
  }

  public async clickMenu(menu: string): Promise<void> {
    const linkHandler = await PageAdmin.getLinkHandlerMenu(menu);
    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
      linkHandler.click()
    ]);
  }

  public async waitForSubMenu(subMenu: string): Promise<void> {
    const linkHandler = await PageAdmin.getLinkHandlerSubMenu(subMenu);
    await linkHandler.focus();
  }

  public async clickSubMenu(subMenu: string): Promise<void> {
    const linkHandler = await PageAdmin.getLinkHandlerSubMenu(subMenu);
    await Promise.all([
      page.waitForNavigation({ waitUntil: ["load", "networkidle2"] }),
      linkHandler.click()
    ]);
  }

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  private static async getLinkHandlerMenu(menu: string): Promise<ElementHandle<Element>> {
    const escapedMenu = RoutineOperation.escapeXpathString(menu);
    return this.getLinkHandler(`//div[@class="wp-menu-name" and contains(text(), ${escapedMenu})]`);
  }

  private static async getLinkHandlerSubMenu(subMenu: string) {
    const escapedSubMenu = RoutineOperation.escapeXpathString(subMenu);
    return await PageAdmin.getLinkHandler(`//a[text()=${escapedSubMenu}]`);
  }

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  private static async getLinkHandler(xpath: string): Promise<ElementHandle<Element>> {
    const linkHandler = await page.$(`xpath/.${xpath}`);
    if (linkHandler === null) {
      throw new Error(`Link not found: ${xpath}`);
    }
    return linkHandler;
  }
}
