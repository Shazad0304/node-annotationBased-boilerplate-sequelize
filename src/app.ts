// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';
import { CORS_ORIGINS, CREDENTIALS, isProduction, PORT, SENTRY_DSN, jwtStrategy, ROUTE_PREFIX } from './config';

import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, ErrorRequestHandler, RequestHandler } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import passport from 'passport';
import { useExpressServer } from 'routing-controllers';
import xss from 'xss-clean';

import handlingErrorsMiddleware from './middlewares/handlingErrors.middleware';
import sequelize from './db/sequelize';

let serverConnection: http.Server;

export default class App {
  private app: Application;
  private port: string | number;
  private controllers: Function[] = [];

  constructor(controllers: Function[]) {
    this.app = express();
    this.port = PORT || 8080;
    this.controllers = controllers;

    this.initSentry();
    this.initMiddlewares();
    this.initRoutes(controllers);

    this.initHandlingErrors();
  }

  private initSentry() {
    if (isProduction) {
      Sentry.init({ dsn: SENTRY_DSN });
      // The request handler must be the first middleware on the app
      this.app.use(Sentry.Handlers.requestHandler() as RequestHandler);
    }
  }

  private initMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors({ origin: CORS_ORIGINS }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // sanitize user data
    this.app.use(hpp());
    this.app.use(xss());
    this.app.use(cookieParser());

    // jwt authentication
    this.app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);
  }

  private initRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: CORS_ORIGINS,
        credentials: CREDENTIALS,
      },
      routePrefix: ROUTE_PREFIX,
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initHandlingErrors() {
    if (isProduction) {
      // The error handler must be before any other error middleware and after all controllers
      this.app.use(Sentry.Handlers.errorHandler() as ErrorRequestHandler);
    }
    this.app.use(handlingErrorsMiddleware);
  }

  static async initDB() {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');
      await sequelize.sync(); // This will create any missing tables based on your Sequelize model definitions
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  static async closeDB() {
    try {
      await sequelize.close();
      console.log('Connection to the database closed');
    } catch (error) {
      console.error('Error closing the database connection:', error);
      throw error;
    }
  }

  public initWebServer = async () => {
    return new Promise(resolve => {
      serverConnection = this.app.listen(this.port, () => {
        console.log(`✅  Ready on port http://localhost:${this.port}`);

        resolve(serverConnection.address());
      });
    });
  };

  public initServerWithDB = async () => {
    await Promise.all([App.initDB(), this.initWebServer()]);
  };

  public stopWebServer = async () => {
    return new Promise(resolve => {
      serverConnection.close(() => {
        resolve(void 0);
      });
    });
  };

  public getServer = () => {
    return this.app;
  };

  public get getControllers() {
    return this.controllers;
  }
}
