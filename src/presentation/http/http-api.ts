import { getLogger } from '@infrastructure/logging/index.js';
import type Api from '@presentation/api.interface.js';
import type { HttpApiConfig } from '@infrastructure/config/index.js';
import type { FastifyInstance, FastifyBaseLogger } from 'fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { fastifyOauth2 } from '@fastify/oauth2';
import { notFound, forbidden, unauthorized, notAcceptable, domainError } from './decorators/index.js';
import type { DomainServices } from '@domain/index.js';
import AuthRouter from '@presentation/http/router/auth.js';
import UserRouter from './router/user.js';
import OauthRouter from './router/oauth.js';
import EventsRouter from './router/events.js';
import { RequestParams, Response } from '@presentation/api.interface.js';
import Policies from './policies/index.js';
import addUserIdResolver from './middlewares/common/userIdResolver.js';

const appServerLogger = getLogger('appServer');

export default class HttpApi implements Api {
  /**
   * Fastify server instance
   */
  private server: FastifyInstance | undefined;

  constructor(private readonly config: HttpApiConfig) { }

  public async init(domainServices: DomainServices): Promise<void> {
    this.server = fastify({logger: appServerLogger as FastifyBaseLogger});

    this.addDecorators();

    await this.addCookies();
    await this.addOauth2();
    await this.addCORS();
    this.addCommonMiddlewares(domainServices);
    this.addPoliciesCheckHook(domainServices);

    await this.addApiRoutes(domainServices);
  }

  /**
   * Registers all routers
   *
   * @param domainServices - instances of domain services
   */
  private async addApiRoutes(domainServices: DomainServices): Promise<void> {
    await this.server?.register(EventsRouter, {
      prefix: '/events',
      eventService: domainServices.eventsService,
    });

    await this.server?.register(OauthRouter, {
      prefix: '/oauth',
      userService: domainServices.userService,
      authService: domainServices.authService,
      cookieDomain: this.config.cookieDomain,
    });

    await this.server?.register(AuthRouter, {
      prefix: '/auth',
      authService: domainServices.authService,
    });

    await this.server?.register(UserRouter, {
      prefix: '/user',
      userService: domainServices.userService,
    });
  }

  /**
   * Runs http server
   */
  public async run(): Promise<void> {
    if (this.server === undefined) {
      throw new Error('Server is not initialized');
    }

    await this.server.listen({
      host: this.config.host,
      port: this.config.port,
    });
  }

  /**
   * Add custom decorators
   */
  private addDecorators(): void {
    this.server?.decorateReply('notFound', notFound);
    this.server?.decorateReply('forbidden', forbidden);
    this.server?.decorateReply('unauthorized', unauthorized);
    this.server?.decorateReply('notAcceptable', notAcceptable);
    this.server?.decorateReply('domainError', domainError);
  }
  /**
   * Registers oauth2 plugin
   */
  private async addOauth2(): Promise<void> {
    await this.server?.register(fastifyOauth2, {
      name: 'googleOAuth2',
      scope: ['profile', 'email'],
      credentials: {
        client: {
          id: this.config.oauth2.google.clientId,
          secret: this.config.oauth2.google.clientSecret,
        },
        auth: fastifyOauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: this.config.oauth2.google.redirectUrl,
      callbackUri: this.config.oauth2.google.callbackUrl,
    });
  }

  /**
   * Allows cors for allowed origins from config
   */
  private async addCORS(): Promise<void> {
    await this.server?.register(cors, {
      origin: this.config.allowedOrigins,
    });
  }
  /**
   * Add middlewares
   * @param domainServices - instances of domain services
   */
  private addCommonMiddlewares(domainServices: DomainServices): void {
    if (this.server === undefined) {
      throw new Error('Server is not initialized');
    }

    addUserIdResolver(this.server, domainServices.authService, appServerLogger);
  }

  /**
   * Adds support for reading and setting cookies
   */
  private async addCookies(): Promise<void> {
    await this.server?.register(cookie, {
      secret: this.config.cookieSecret,
    });
  }

  /**
   * Add "onRoute" hook that will add "preHandler" checking policies passed through the route config
   * @param domainServices - instances of domain services
   */
  private addPoliciesCheckHook(domainServices: DomainServices): void {
    this.server?.addHook('onRoute', (routeOptions) => {
      const policies = routeOptions.config?.policy ?? [];

      if (policies.length === 0) {
        return;
      }

      /**
       * Save original route preHandler(s) if exists
       */
      if (routeOptions.preHandler === undefined) {
        routeOptions.preHandler = [];
      } else if (!Array.isArray(routeOptions.preHandler)) {
        routeOptions.preHandler = [routeOptions.preHandler];
      }

      routeOptions.preHandler.push(async (request, reply) => {
        for (const policy of policies) {
          const policyFunction = Policies[policy as keyof typeof Policies];
          if (policyFunction) {
            await policyFunction({ request, reply, domainServices });
          }
        }
      });
    });
  }

  /**
   * Performs fake request to API routes.
   * Used for API testing
   * @param params - request options
   */
  public async fakeRequest(params: RequestParams): Promise<Response | undefined> {
    const response = await this.server?.inject(params);

    if (response === undefined) {
      return;
    }

    return {
      statusCode: response.statusCode,
      body: response.body,
      headers: response.headers,
      json: response.json,
    };
  }
}
