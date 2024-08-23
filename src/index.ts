import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import helmet from 'helmet';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';

import { ROUTE_PREFIX } from '@config';
import { v1Controllers } from '@v1/index';

import App from './app';

function initSwagger(server: App) {
  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: classTransformerDefaultMetadataStorage,
    refPointerPrefix: '#/components/schemas/',
  });
  const routingControllersOptions = {
    controllers: server.getControllers,
    routePrefix: ROUTE_PREFIX,
  };
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, routingControllersOptions, {
    openapi: '3.0.0',
    info: {
      description: 'API Generated with `routing-controllers-openapi` package',
      title: 'BINNAH API',
      version: '1.0.0',
    },
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  });
  server.getServer().use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
  server.getServer().use(helmet());
}

const server = new App([...v1Controllers]);
initSwagger(server);

(async () => {
  await server.initServerWithDB();
})();

const gracefulShutdown = async () => {
  try {
    await server.stopWebServer();
    await App.closeDB();

    console.log(`Process ${process.pid} received a graceful shutdown signal`);
    process.exit(0);
  } catch (error) {
    console.log(`graceful shutdown Process ${process.pid} got failed!`);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown).on('SIGINT', gracefulShutdown);
