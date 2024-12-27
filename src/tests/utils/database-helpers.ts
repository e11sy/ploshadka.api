import User from "@domain/entities/user.js";
import { QueryTypes } from "sequelize";

/**
 * default type for user mock creation attributes
 */
type UserMockCreationAttributes = {
  email?: User['email'];
  name?: User['name'];
};

/**
 * class with database helper functions which are inserting mocks into database
 */
export default class DatabaseHelpers {
  private orm;

  /**
   *
   * @param orm - sequelizeOrm instance
   */
  /* eslint-disable-next-line */
  constructor(orm: any) {
    this.orm = orm;
  }

  /**
   * Executes specified sql query in test DB.
   * Might be used in tests to perform some specific database operations
   * @param sqlString - string containing sql to executein test DB
   */
  public async query(sqlString: string): Promise<unknown> {
    return await this.orm.connection.query(sqlString);
  }

    /**
   * Inserts user mock to then db
   * @param user - user object which contain all info about user
   *
   * If name is not passed, it's value in database would be {random}
   * If email is not passed, it's value in database would be '{random}@mail.com'
   * If editorTools is not passed, it's value in database would be []
   */
  public async insertUser(user?: UserMockCreationAttributes): Promise<User> {
    const name = user?.name ?? `user-${Math.random()}`;
    const email = user?.email ?? `${Math.random()}@mail.com`;

    const [results, _] = await this.orm.connection.query(`INSERT INTO public.users ("email", "name")
    VALUES ('${email}', '${name}')
    RETURNING "id", "email", "name"`,
    {
      type: QueryTypes.INSERT,
      returning: true,
    });
    const createdUser = results[0];

    return createdUser;
  }


  /**
   * Truncates all tables and restarts all autoincrement sequences
   */
  public async truncateTables(): Promise<void> {
    await this.orm.connection.query(`DO $$
      DECLARE
        -- table iterator
        tbl RECORD;
        -- sequence iterator
        seq RECORD;
      BEGIN
        -- truncate all tables (except migrations) in database
        FOR tbl IN
          SELECT * FROM information_schema.tables
          WHERE table_name!= 'migrations'
          AND table_schema= 'public'
          AND table_type= 'BASE TABLE'
        LOOP
          EXECUTE format('TRUNCATE public.%s CASCADE', tbl.table_name);
        END LOOP;

        -- restart all sequences
        -- (autoincrement should start with 1 when test-data is truncated)
        FOR seq IN
          SELECT * FROM information_schema.sequences
          WHERE sequence_schema= 'public'
        LOOP
          EXECUTE format('ALTER sequence %s RESTART WITH 1', seq.sequence_name);
        END LOOP;
      END $$ LANGUAGE plpgsql;`);
  }
}
