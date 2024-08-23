import { AuthController as AuthControllerV1 } from '@v1/auth/auth.controller';
import { HealthCheckController as HealthCheckControllerV1 } from '@v1/health-check/healthCheck.controller';
import { UserController as UserControllerV1 } from '@v1/user/user.controller';
import { MediaController as MediaControllerV1 } from '@v1/media/media.controller';

export const v1Controllers = [HealthCheckControllerV1, UserControllerV1, AuthControllerV1, MediaControllerV1];
