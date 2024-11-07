import config from '@infrastructure/config/index.js';
import API from '@presentation/index.js';
import logger from '@infrastructure/logging/index.js';
import { init as initDomainServices } from '@domain/index.js';
import { initORM, init as initRepositories } from '@repository/index.js';

/**
 * Application entry point
 */
const start = async (): Promise<void> => {
  try {
    const orm = await initORM(config.database);
    const repositories = await initRepositories(orm);
    const domainServices = initDomainServices(repositories, config);
    const api = new API(config.httpApi);

    await api.init(domainServices);
    await api.run();

    logger.info('Application launched succcessfully');
  } catch (err) {
    logger.fatal('Failed to start application ' + err);
    process.exit(1);
  }
};

try {
  await start();
} catch (err) {
  logger.fatal('Failed to start application ' + err);
  process.exit(1);
}

