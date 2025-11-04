import RoutineOperation from "../RoutineOperation";
import { Page } from "@playwright/test";

export default class PagePlugins {
  constructor(private page: Page) {}

  public async activatePlugin(pluginName: string) {
    const escapedPluginName = RoutineOperation.escapeXpathString(pluginName);
    const linkHandler = this.page.locator(`xpath=.//strong[text()=${escapedPluginName}]/following-sibling::div//a[text()="Activate"]`).first();

    await linkHandler.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
