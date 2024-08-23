import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import { NotFoundError } from 'routing-controllers';

import { TokenTypes } from '@common/constants';
import { APP_BASE_URL, jwt } from '@config';
import TokenEntity from '@models/tokens.model'; // Assuming this is the correct Sequelize model import
import { IUser } from '@models/users.model'; // Assuming this is the correct Sequelize model import
import { UserService } from '@services/v1/user.service';
import { sendEmail } from '@utils/mail';

export class TokenService {
  private readonly userService = new UserService();

  async generateAuthTokens(user: IUser) {
    const accessTokenExpire = moment().add(jwt.accessExpireIn as moment.unitOfTime.DurationConstructor, jwt.accessExpireFormat);
    const accessToken = this.generateToken(user.id, accessTokenExpire.unix(), TokenTypes.ACCESS);

    const refreshTokenExpire = moment().add(jwt.refreshExpireIn as moment.unitOfTime.DurationConstructor, jwt.refreshExpireFormat);
    const refreshToken = this.generateToken(user.id, refreshTokenExpire.unix(), TokenTypes.REFRESH);
    console.log(refreshToken, user.id, refreshTokenExpire.toDate(), TokenTypes.REFRESH);
    await this.saveToken(refreshToken, user.id, refreshTokenExpire.toDate(), TokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpire.unix(),
      },
      refresh: {
        token: refreshToken,
        expire: refreshTokenExpire.unix(),
      },
    };
  }

  generateToken(userId: number, expire: number, type: string) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expire,
      type,
    };

    return jsonwebtoken.sign(payload, jwt.secret);
  }

  async saveToken(token: string, userId: number, expires: Date, type: TokenTypes, blacklisted = false) {
    console.log({
      token,
      userId,
      expires,
      type,
      blacklisted,
    });
    await TokenEntity.create({
      token,
      userId,
      expires,
      type,
      blacklisted,
    });
  }

  async verifyToken(token: string, type: string) {
    const payload = jsonwebtoken.verify(token, jwt.secret);
    const tokenDoc = await TokenEntity.findOne({ where: { token, type, userId: payload.sub, blacklisted: false } });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  async generateResetPasswordToken(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not exists with this email');
    }

    const expireIn = moment().add(jwt.resetPasswordExpireIn as moment.unitOfTime.DurationConstructor, jwt.resetPasswordExpireFormat);
    const resetPasswordToken = this.generateToken(user.id, expireIn.unix(), TokenTypes.RESET_PASSWORD);
    sendEmail({
      to: user.email,
      subject: 'Reset password request',
      text: `Your reset password link for the application is ${APP_BASE_URL}/reset_password?token=${resetPasswordToken}`,
    });
    await this.saveToken(resetPasswordToken, user.id, expireIn.toDate(), TokenTypes.RESET_PASSWORD);

    return resetPasswordToken;
  }
}
