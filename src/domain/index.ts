import type { Repositories } from '@repository/index.js';
import AuthService from './service/auth.js';
import UserService from './service/user.js'
import EventsService from './service/events.js'
import type { AppConfig } from '@infrastructure/config/index.js';
import CourtsService from './service/courts.js';

export interface DomainServices {
  eventsService: EventsService;

  userService: UserService;

  authService: AuthService;

  courtsService: CourtsService;
};

/**
 * Initiate services
 *
 * @param repositories - repositories
 * @param appConfig - app config
 */
export function init(repositories: Repositories, appConfig: AppConfig): DomainServices {
  const eventsService = new EventsService(repositories.eventsRepository);
  const userService = new UserService(repositories.userRepository);
  const authService = new AuthService(
    appConfig.auth.accessSecret,
    appConfig.auth.accessExpiresIn,
    appConfig.auth.refreshExpiresIn,
    repositories.userSessionRepository
  );
  const courtsService = new CourtsService(repositories.courtsRepository);

  return {
    eventsService,
    userService,
    authService,
    courtsService,
  }
}
