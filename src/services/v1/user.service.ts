import bcrypt from 'bcrypt';
import { BadRequestError } from 'routing-controllers';

import { UserRole } from '@common/constants';
import UserEntity from '@models/users.model';

export class UserService {
  async isEmailTaken(email: string): Promise<boolean> {
    const user = await UserEntity.findOne({ where: { email } });
    return !!user;
  }

  async isUserNameTaken(username: string): Promise<boolean> {
    const user = await UserEntity.findOne({ where: { username } });
    return !!user;
  }

  async createUser(userData: { email: string; username: string; password: string }) {
    const { email, username, password } = userData;
    if (await this.isEmailTaken(email)) {
      throw new BadRequestError('Email already taken');
    }
    if (await this.isUserNameTaken(username)) {
      throw new BadRequestError('Username already taken');
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await UserEntity.create({ email, username, password: hashedPassword });
    return user;
  }

  async getUserByEmail(email: string) {
    return await UserEntity.findOne({ where: { email } });
  }

  async comparePassword(inputPass: string, userPass: string) {
    return await bcrypt.compare(inputPass, userPass);
  }

  async getById(id: string) {
    return await UserEntity.findByPk(String(id));
  }

  async updateById(id: number, updateBody: Partial<UserEntity>) {
    // Prevent user from changing their email
    delete updateBody.email;

    const user = await UserEntity.findByPk(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    Object.assign(user, updateBody);
    await user.save();

    return user;
  }

  async deleteUserById(id: string) {
    const user = await UserEntity.findByPk(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    // restrict admin from deleting themselves
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestError('Admin cannot be deleted');
    }
    await user.destroy();
    return { message: 'User deleted successfully!', success: true };
  }

  async findAll(limit = 10, page = 1) {
    const offset = (page - 1) * limit;
    const { rows: docs, count: totalDocs } = await UserEntity.findAndCountAll({
      where: { role: UserRole.USER },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      docs: docs.map(doc => ({ ...doc.toJSON(), password: null, id: doc.id })),
      meta: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit) || 0,
        page,
      },
    };
  }
}
