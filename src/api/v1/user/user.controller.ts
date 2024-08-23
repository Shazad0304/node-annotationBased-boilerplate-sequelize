import { Body, Delete, Get, JsonController, Params, Post, Put, QueryParams, Req, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { UserRole } from '@common/constants';
import { IdRequestDto, ListingRequestDto } from '@common/dtos/common.dtos';
import auth from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { IUser } from '@models/users.model';
import { UserService } from '@services/v1';
import RegisterDto from '@v1/auth/dtos/register.dto';

@JsonController('/v1/users', { transformResponse: false })
export class UserController {
  private readonly userService = new UserService();

  @Get('')
  @OpenAPI({ summary: 'get users' })
  @ResponseSchema(IUser, { isArray: true })
  @UseBefore(validationMiddleware(ListingRequestDto, 'query'))
  @UseBefore(auth([UserRole.ADMIN]))
  async getAll(@QueryParams() requestData: ListingRequestDto) {
    const users = await this.userService.findAll(requestData.limit, requestData.page);
    return { users };
  }

  @Put('/')
  @OpenAPI({ summary: 'update Profile' })
  @ResponseSchema(IUser)
  @UseBefore(auth([UserRole.ADMIN, UserRole.USER]))
  async updateUser(@Req() req: Request & { user: IUser }, @Body() payload: Partial<IUser>) {
    const user = await this.userService.updateById(req.user.id, payload);
    return { ...user };
  }

  @Post('/add')
  @OpenAPI({ summary: 'Add User Single' })
  @ResponseSchema(IUser)
  @UseBefore(validationMiddleware(RegisterDto, 'body'))
  @UseBefore(auth([UserRole.ADMIN]))
  async AddUser(@Body() payload: RegisterDto) {
    const user = await this.userService.createUser(payload);
    return { user };
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'delete User' })
  @ResponseSchema(IUser)
  @UseBefore(validationMiddleware(IdRequestDto, 'param'))
  @UseBefore(auth([UserRole.ADMIN]))
  async deleteUser(@Params() { id }: IdRequestDto) {
    const response = await this.userService.deleteUserById(id);
    return response;
  }
  @Get('/:id')
  @OpenAPI({ summary: 'Get User By Id' })
  @ResponseSchema(IUser)
  @UseBefore(validationMiddleware(IdRequestDto, 'param'))
  @UseBefore(auth([UserRole.ADMIN]))
  async getUserById(@Params() { id }: IdRequestDto) {
    const response = await this.userService.getById(id);
    return { ...response };
  }

  @Put('/:id')
  @OpenAPI({ summary: 'update Profile by id' })
  @ResponseSchema(IUser)
  @UseBefore(validationMiddleware(IdRequestDto, 'param'))
  @UseBefore(auth([UserRole.ADMIN]))
  async updateUserById(@Params() { id }: IdRequestDto, @Body() payload: Partial<IUser>) {
    const user = await this.userService.updateById(Number(id), payload);
    return { ...user };
  }
}
