import { DataSource } from "typeorm";
import { WpOption } from "./entities/WpOption";
import ormconfig from "../ormconfig";

export default class TableCleaner {
  public static async clean() {
    let connection;
    try {
      const myDataSource = new DataSource(ormconfig);
      connection = await myDataSource.initialize();

      const wpOptionRepository = connection.getRepository(WpOption);
      await wpOptionRepository.delete({optionName: 'StaticPress::static url'});
      await wpOptionRepository.delete({optionName: 'StaticPress::static dir'});
      await wpOptionRepository.delete({optionName: 'StaticPress::timeout'});
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.destroy();
      }
    }
  };
}