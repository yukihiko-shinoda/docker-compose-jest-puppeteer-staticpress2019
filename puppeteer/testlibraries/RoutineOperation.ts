import { Page } from "puppeteer";
export default class RoutineOperation {
  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  public static async clickByText(page: Page, tag: string, text: string): Promise<void> {
    const escapedText = this.escapeXpathString(text);
    const linkHandler = await page.$(`xpath/.//${tag}[contains(text(), ${escapedText})]`);

    if (linkHandler === null) {
      throw new Error(`Link not found: ${text}`);
    }
    await linkHandler.click();
  };

  // @see https://gist.github.com/tokland/d3bae3b6d3c1576d8700405829bbdb52
  public static escapeXpathString(str: string): string {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };
}
