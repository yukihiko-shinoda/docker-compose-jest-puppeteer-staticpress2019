import 'reflect-metadata';
import { test, expect, Page } from '@playwright/test';
import { DataSource } from "typeorm";
import ormconfig from "../ormconfig";
import PageWelcome from "../testlibraries/pages/PageWelcome";
import PageLogin from "../testlibraries/pages/PageLogin";
import RoutineOperation from "../testlibraries/RoutineOperation"
import PageAdmin from "../testlibraries/pages/PageAdmin";
import PagePlugins from "../testlibraries/pages/PagePlugins";
import PageStaticPressOptions from "../testlibraries/pages/PageStaticPressOptions";
import FixtureLoader from "../testlibraries/FixtureLoader";
import TableCleaner from "../testlibraries/TableCleaner";
import PageStaticPress from "../testlibraries/pages/PageStaticPress";
import PageLanguageChooser from "../testlibraries/pages/PageLanguageChooser";
import * as dotenv from 'dotenv';

dotenv.config();

test.describe('All', () => {
  const host = process.env.HOST || "http://localhost/";
  const basicAuthenticationUserName = "authuser";
  const basicAuthenticationUserPassword = "authpassword";
  const userName = "test_user";
  const userPassword = "-JfG+L.3-s!A6YmhsKGkGERc+hq&XswU";

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Start basic authentication");
    await page.goto(host).catch(err => {
      console.log(err)
      throw err || new Error('page.goto() failed with empty error');
    });
    console.log("Finish basic authentication");
    await page.screenshot({ path: 'screenshot1.png' });

    // From WordPress 5.4.2, language select page is displayed at first.
    const pageLanguageChooser = new PageLanguageChooser(page);
    if (await pageLanguageChooser.isDisplayedNow()) {
      console.log("Start choose language");
      await pageLanguageChooser.choose("English (United States)");
      console.log("Finish choose language");
    }
    const pageWelcome = new PageWelcome(page);
    if (await pageWelcome.isDisplayedNow()) {
      console.log("Start Initialize");
      await initialize(page);
      console.log("Finish Initialize");
      await context.close();
      return;
    }
    console.log("Start login");
    await login(page);
    console.log("Finish login");
    await context.close();
  });

  async function initialize(page: Page) {
    console.log("Start Initialize");
    const pageWelcome = new PageWelcome(page);
    await pageWelcome.install("test_title", userName, userPassword, "test@gmail.com");

    await RoutineOperation.clickByText(page, 'a', 'Log In');
    await page.waitForLoadState('networkidle');

    await login(page);
    const pageAdmin = new PageAdmin(page);
    await pageAdmin.clickMenu('Plugins');
    const pagePlugins = new PagePlugins(page);
    await pagePlugins.activatePlugin('StaticPress2019');
  }

  async function login(page: Page) {
    await page.goto(host + 'wp-admin/', { waitUntil: 'networkidle' });
    const pageLogin = new PageLogin(page);
    await pageLogin.login(userName, userPassword);
  }

  test.beforeEach(async () => {
    console.log("Inserting fixtures into the database...");
    await TableCleaner.clean().catch(err => {
      console.log(err)
      throw err || new Error('TableCleaner.clean() failed with empty error');
    });
    await FixtureLoader.load('./testlibraries/fixtures/WpOptionsStaticPress2019.yml').then(() => {
      console.log('Fixtures are successfully loaded.');
    }).catch(err => {
      console.log(err)
      throw err || new Error('FixtureLoader.load() failed with empty error');
    });
    console.log("Inserted fixtures into the database.");
  });

  /**
   * Option should set into database.
   * Home page should dump by rebuild even if basic authentication is enable.
   */
  test("sets option and rebuilds", async ({ page }) => {
    await page.goto(host + 'wp-admin/', { waitUntil: 'networkidle' });
    const pageLogin = new PageLogin(page);
    await pageLogin.login(userName, userPassword);
    const pageAdmin = new PageAdmin(page);
    await pageAdmin.hoverMenu('StaticPress2019');
    await pageAdmin.waitForSubMenu('StaticPress2019 Options');
    await pageAdmin.clickSubMenu('StaticPress2019 Options');

    const pageStaticPressOptions = new PageStaticPressOptions(page);
    const staticUrl = 'http://example.com/sub/';
    const dumpDirectory = '/tmp/static/';
    const requestTimeout = '10';
    await pageStaticPressOptions.setOptions(
      staticUrl,
      dumpDirectory,
      basicAuthenticationUserName,
      basicAuthenticationUserPassword,
      requestTimeout
    );
    let connection;
    try {
      const myDataSource = new DataSource(ormconfig)
      connection = await myDataSource.initialize()

      // Use raw queries to avoid importing entities with decorators at module load time
      const wpOptionStaticUrl = await connection.query(
        "SELECT option_value FROM wp_options WHERE option_name = 'StaticPress::static url'"
      );
      expect(wpOptionStaticUrl[0].option_value).toEqual(staticUrl);

      const wpOptionDumpDirectory = await connection.query(
        "SELECT option_value FROM wp_options WHERE option_name = 'StaticPress::static dir'"
      );
      expect(wpOptionDumpDirectory[0].option_value).toEqual(dumpDirectory);

      const wpOptionRequestTimeout = await connection.query(
        "SELECT option_value FROM wp_options WHERE option_name = 'StaticPress::timeout'"
      );
      expect(wpOptionRequestTimeout[0].option_value).toEqual(requestTimeout);
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.destroy();
      }
    }
    await pageAdmin.hoverMenu('StaticPress2019');
    await pageAdmin.waitForSubMenu('StaticPress2019');
    await pageAdmin.clickSubMenu('StaticPress2019');
    const pageStaticPress = new PageStaticPress(page);
    await pageStaticPress.clickRebuild();
    await expect(page.locator('li', { hasText: /.*\/tmp\/static\/sub\/index\.html/ })).toBeVisible();
  });
});
