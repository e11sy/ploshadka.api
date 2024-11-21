import type { DatabaseConfig } from '@infrastructure/config/index.js';
import Orm from './storage/postgres/orm/index.js';
import GoogleApiTransport from '@repository/transport/google-api/index.js';
import EventsRepository from '@repository/events.repository.js';
import UserSessionRepository from '@repository/userSession.repository.js';
import UserRepository from '@repository/user.repository.js';
import UserSessionStorage from './storage/userSession.storage.js';
import UserStorage from './storage/user.storage.js';
import EventStorage from './storage/events.storage.js';

export interface Repositories {
  eventsRepository: EventsRepository;

  userSessionRepository: UserSessionRepository,

  userRepository: UserRepository;
}

/**
 * Initiate ORM
 *
 * @param databaseConfig - database config
 */
export async function initORM(databaseConfig: DatabaseConfig): Promise<Orm> {
  const orm = new Orm(databaseConfig);

  /**
   * Test the connection by trying to authenticate
   */
  await orm.authenticate();

  return orm;
}

/**
 * Initiate repositories
 *
 * @param orm - ORM instance
 * @param s3Config - S3 storage config
 */
export async function init(orm: Orm): Promise<Repositories> {
  /**
   * Create storage instances
   */
  const eventStorage = new EventStorage(orm);
  const userStorage = new UserStorage(orm)
  const userSessionsStorage = new UserSessionStorage(orm);

  await eventStorage.model.sync();
  await userStorage.model.sync();
  await userSessionsStorage.model.sync();


  /**
   * Create transport instances
   */
  const googleApiTransport = new GoogleApiTransport();

  const eventsRepository = new EventsRepository(eventStorage);
  const userSessionRepository = new UserSessionRepository(userSessionsStorage);
  const userRepository = new UserRepository(userStorage, googleApiTransport);

  return {
    eventsRepository,
    userSessionRepository,
    userRepository,
  }
}

