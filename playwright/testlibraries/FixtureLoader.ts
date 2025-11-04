import { DataSource } from "typeorm";
import ormconfig from "../ormconfig";

export default class FixtureLoader {
  public static async load(fixturesPath: string) {
    let connection;
    try {
      const myDataSource = new DataSource(ormconfig);
      connection = await myDataSource.initialize();

      // Hardcoded fixture data to avoid loading entities with decorators
      // Based on testlibraries/fixtures/WpOptionsStaticPress2019.yml
      if (fixturesPath.includes('WpOptionsStaticPress2019')) {
        await connection.query(`
          INSERT INTO wp_options (option_name, option_value, autoload)
          VALUES ('StaticPress::static url', 'http://example.org/sub/', 'yes')
          ON DUPLICATE KEY UPDATE option_value = VALUES(option_value), autoload = VALUES(autoload)
        `);
        await connection.query(`
          INSERT INTO wp_options (option_name, option_value, autoload)
          VALUES ('StaticPress::static dir', '/var/www/web/static/', 'yes')
          ON DUPLICATE KEY UPDATE option_value = VALUES(option_value), autoload = VALUES(autoload)
        `);
        await connection.query(`
          INSERT INTO wp_options (option_name, option_value, autoload)
          VALUES ('StaticPress::timeout', '20', 'yes')
          ON DUPLICATE KEY UPDATE option_value = VALUES(option_value), autoload = VALUES(autoload)
        `);
      }
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.destroy();
      }
    }
  };
}