import RoutineOperation from "../RoutineOperation";
import { ElementHandle } from "puppeteer";

export default class PagePlugins {
  public async activatePlugin(pluginName: string) {
    const escapedPluginName = RoutineOperation.escapeXpathString(pluginName);
    const linkHandlers = await page.$x(`//strong[text()=${escapedPluginName}]/following-sibling::div//a[text()="Activate"]`);

    if (linkHandlers.length <= 0) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      (linkHandlers[0] as ElementHandle<Element>).click()
    ]);
  }
}
