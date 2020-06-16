import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import { createConnection, getRepository, ObjectLiteral } from "typeorm";

export default class FixtureLoader {
  public static async load(fixturesPath: string) {
    let connection;
    try {
      connection = await createConnection();

      const loader = new Loader();
      loader.load(path.resolve(fixturesPath));

      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(connection, new Parser());

      for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        if (!this.implementsObjectLiteral(entity)) {
          throw new Error('Entity doesn\'t implement ObjectLiteral.');
        }
        await getRepository(entity.constructor.name).save(entity);
      }
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        await connection.close();
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