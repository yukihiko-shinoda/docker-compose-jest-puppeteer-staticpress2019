import { DataSource } from "typeorm";
import ormconfig from "../ormconfig";

export default class TableCleaner {
  public static async clean() {
    let connection;
    try {
      const myDataSource = new DataSource(ormconfig);
      connection = await myDataSource.initialize();

      // Use raw query to avoid importing entities with decorators at module load time
      await connection.query("DELETE FROM wp_options WHERE option_name = 'StaticPress::static url'");
      await connection.query("DELETE FROM wp_options WHERE option_name = 'StaticPress::static dir'");
      await connection.query("DELETE FROM wp_options WHERE option_name = 'StaticPress::timeout'");
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.destroy();
      }
    }
  };
}