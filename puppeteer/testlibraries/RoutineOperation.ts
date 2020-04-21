import { Page } from "puppeteer";
export default class RoutineOperation {
  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  public static async clickByText(page: Page, tag: string, text: string): Promise<void> {
    const escapedText = this.escapeXpathString(text);
    const linkHandlers = await page.$x(`//${tag}[contains(text(), ${escapedText})]`);

    if (linkHandlers.length <= 0) {
      throw new Error(`Link not found: ${text}`);
    }
    await linkHandlers[0].click();
  };

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  public static escapeXpathString(str: string): string {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };
}
