import { loadConfig } from '@codex-team/config-loader';
import * as process from 'process';
import * as path from 'path';
import arg from 'arg';
import { z } from 'zod';

/**
 * Authentication configuration
 */
const AuthConfig = z.object({
  accessSecret: z.string(),
  refreshSecret: z.string(),
  accessExpiresIn: z.number(),
  refreshExpiresIn: z.number(),
});

export type AuthConfig = z.infer<typeof AuthConfig>;

const GoogleOAuth2Config = z.object({
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUrl: z.string(),
  callbackUrl: z.string(),
});

export type GoogleOAuth2Config = z.infer<typeof GoogleOAuth2Config>;

const OAuth2Config = z.object({
  google: GoogleOAuth2Config,
});

export type OAuth2Config = z.infer<typeof OAuth2Config>;

/**
 * Database configuration
 */
const DatabaseConfig = z.object({
  dsn: z.string(), // todo url or params
});

/**
 * Available logging levels configuration
 */
const LoggingLevel = z.union([
  z.boolean(), // disabled if false, 'info' if true
  z.literal('fatal'),
  z.literal('error'),
  z.literal('warn'),
  z.literal('info'),
  z.literal('debug'),
  z.literal('trace'),
  z.literal('silent'),
]);

/**
 * Logging configuration
 */
export const LoggingConfig = z.object({
  global: LoggingLevel,
  metricsServer: LoggingLevel,
  appServer: LoggingLevel,
  database: LoggingLevel,
});

export type LoggingConfig = z.infer<typeof LoggingConfig>;

export type DatabaseConfig = z.infer<typeof DatabaseConfig>;

/**
 * Http API configuration
 */
const HttpApiConfig = z.object({
  fileSizeLimit: z.number(),
  host: z.string(),
  port: z.number(),
  cookieSecret: z.string(),
  cookieDomain: z.string(),
  accessTokenSecret: z.string(),
  allowedOrigins: z.union([z.array(z.string()), z.literal('*')]),
  oauth2: OAuth2Config,
});

export type HttpApiConfig = z.infer<typeof HttpApiConfig>;

/**
 * Application configuration
 */
const AppConfig = z.object({
  httpApi: HttpApiConfig,
  database: DatabaseConfig,
  logging: LoggingConfig,
  auth: AuthConfig,
});

export type AppConfig = z.infer<typeof AppConfig>;

const defaultConfig: AppConfig = {
  httpApi: {
    fileSizeLimit: 10000000, // 10mb
    host: '0.0.0.0',
    port: 3000,
    cookieSecret: 'cookieSecret',
    cookieDomain: 'localhost',
    accessTokenSecret: 'accessTokenSecret',
    allowedOrigins: [],
    oauth2: {
      google: {
        clientId: '',
        clientSecret: '',
        redirectUrl: '/oauth/google/login',
        callbackUrl: '/oauth/google/callback',
      },
    },
  },
  auth: {
    accessSecret: 'accessSecret',
    refreshSecret: 'refreshSecret',
    accessExpiresIn: 900000,
    refreshExpiresIn: 2592000000,
  },
  logging: {
    global: 'info',
    metricsServer: 'info',
    appServer: 'info',
    database: 'info',
  },
  database: {
    dsn: 'postgres://postgres:postgres@postgres/ploshadka',
  },
};

const args = arg({
  '--config': [ String ],
  '-c': '--config',
});

const cwd = process.cwd();
const paths = (args['--config'] || [ './app-config.local.yaml' ]).map((configPath) => {
  if (path.isAbsolute(configPath)) {
    return configPath;
  }

  return path.join(cwd, configPath);
});

const loadedConfig = loadConfig(...[defaultConfig, ...paths]);

const appConfig = AppConfig.parse(loadedConfig);

export default appConfig;
