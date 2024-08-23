import { Get, JsonController, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@JsonController('/health-check', { transformResponse: false })
export class HealthCheckController {
  @Get('/')
  @OpenAPI({ summary: 'Get Healthcheck' })
  async getHealthCheck() {
    return 'success';
  }
}
