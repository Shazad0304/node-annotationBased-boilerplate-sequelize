import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
import { Dialect, Options } from 'sequelize';

const checkEnv = (envVar: string, defaultValue?: string) => {
  if (!process.env[envVar]) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Please define the Enviroment variable"${envVar}"`);
  } else {
    return process.env[envVar] as string;
  }
};

export const PORT: number = parseInt(checkEnv('PORT'), 10);

export const CORS_ORIGINS = checkEnv('CORS_ORIGINS');
export const CREDENTIALS = checkEnv('CREDENTIALS') === 'true';

export const isProduction = checkEnv('NODE_ENV') === 'production';
export const isTest = checkEnv('NODE_ENV') === 'test';

export const SENTRY_DSN = checkEnv('SENTRY_DSN');
export const ROUTE_PREFIX = checkEnv('ROUTE_PREFIX', '');

export const APP_BASE_URL = checkEnv('APP_BASE_URL', '')

export const jwt = {
  secret: checkEnv('JWT_SECRET'),
  accessExpireIn: checkEnv('JWT_ACCESS_EXPIRE_IN'),
  accessExpireFormat: checkEnv('JWT_ACCESS_EXPIRE_FORMAT'),
  refreshExpireIn: checkEnv('JWT_REFRESH_EXPIRE_IN'),
  refreshExpireFormat: checkEnv('JWT_REFRESH_EXPIRE_FORMAT'),
  resetPasswordExpireIn: checkEnv('JWT_RESET_PASSWORD_EXPIRE_IN'),
  resetPasswordExpireFormat: checkEnv('JWT_RESET_PASSWORD_EXPIRE_FORMAT'),
};

export const sequelizeConfig: Options = {
  dialect: checkEnv('DB_DIALECT') as Dialect,
  host: checkEnv('DB_HOST'),
  port: parseInt(checkEnv('DB_PORT')),
  username: checkEnv('DB_USERNAME'),
  password: checkEnv('DB_PASSWORD'),
  database: checkEnv('DB_NAME'),
  logging: false,
};

export const emailConfig = {
  host: checkEnv('DB_HOST',""),
  port: checkEnv('EMAIL_PORT',""),
  user: checkEnv('EMAIL_USER',""),
  password: checkEnv('EMAIL_PASSWORD',"")
}

export const awsConfig = {
  bucketName: checkEnv('AWS_BUCKET_NAME',""),
  region: checkEnv('AWS_REGION',""),
  accessKey: checkEnv('AWS_ACCESS_KEY_ID',""),
  secretKey: checkEnv('AWS_SECRET_ACCESS_KEY',"")
}

export * from './passport';
