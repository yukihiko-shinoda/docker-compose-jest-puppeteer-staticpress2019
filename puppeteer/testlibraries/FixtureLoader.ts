import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { DataSource, ObjectLiteral } from "typeorm";
import ormconfig from "../ormconfig";

export default class FixtureLoader {
  public static async load(fixturesPath: string) {
    let connection;
    try {
      const myDataSource = new DataSource(ormconfig);
      connection = await myDataSource.initialize();

      const loader = new Loader();
      loader.load(path.resolve(fixturesPath));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(connection, new Parser(), false);

      for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        if (!this.implementsObjectLiteral(entity)) {
          throw new Error('Entity doesn\'t implement ObjectLiteral.');
        }
        await connection.getRepository(entity.constructor.name).save(entity);
      }
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.destroy();
      }
    }
  };

  private static implementsObjectLiteral(arg: any): arg is ObjectLiteral {
    if (arg === null || typeof arg !== 'object') {
      return false;
    }
    const propertyNames = Object.getOwnPropertyNames(arg);
    for (const propertyName of propertyNames) {
      if (typeof propertyName !== 'string') {
        return false;
      }
    }
    return true;
  }
}