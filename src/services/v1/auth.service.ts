import { NotFoundError, UnauthorizedError } from 'routing-controllers';

import { TokenTypes } from '@common/constants';
import TokenEntity from '@models/tokens.model'; // Assuming this is the correct Sequelize model import
import { TokenService } from '@services/v1/token.service';
import { UserService } from '@services/v1/user.service';

export class AuthService {
  private readonly tokenService = new TokenService();
  private readonly userService = new UserService();

  async loginUserWithEmailAndPassword(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await this.userService.comparePassword(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }
    return user;
  }

  async logout(refreshToken: string) {
    const token = await TokenEntity.findOne({ where: { token: refreshToken, type: TokenTypes.REFRESH, blacklisted: false } });

    if (!token) {
      throw new NotFoundError('Not Found');
    }

    await token.destroy();
  }

  async refreshAuth(refreshToken: string) {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
      const user = await this.userService.getById(String(refreshTokenDoc.userId));
      if (!user) {
        throw new Error();
      }

      await refreshTokenDoc.destroy();
      const tokens = await this.tokenService.generateAuthTokens(user);
      return { user, tokens };
    } catch (error) {
      if (error.message === 'Token not found' || error.message === 'jwt expired') {
        throw new UnauthorizedError('Token not found');
      }
      throw new UnauthorizedError('Please authenticate');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const tokenDoc = await this.tokenService.verifyToken(token, TokenTypes.RESET_PASSWORD);
      const user = await this.userService.getById(String(tokenDoc.userId));
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.userService.updateById(user.id, { password });
      await TokenEntity.destroy({ where: { userId: user.id } });
    } catch (error) {
      if (error.message === 'Token not found' || error.message === 'jwt expired') {
        throw new UnauthorizedError('Token not found');
      }
      throw error;
    }
  }
}
