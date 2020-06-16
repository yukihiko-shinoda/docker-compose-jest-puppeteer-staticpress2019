import { createConnection, getRepository } from "typeorm";
import { WpOption } from "./entities/WpOption";

export default class TableCleaner {
  public static async clean() {
    let connection;
    try {
      connection = await createConnection();

      const wpOptionRepository = getRepository(WpOption);
      await wpOptionRepository.delete({optionName: 'StaticPress::static url'});
      await wpOptionRepository.delete({optionName: 'StaticPress::static dir'});
      await wpOptionRepository.delete({optionName: 'StaticPress::timeout'});
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  };
}