import bcrypt from 'bcrypt';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { DataTypes, Model } from 'sequelize';

import { UserRole } from '@common/constants';

import sequelize from '../db/sequelize';

export class IUser {
  @IsNumber()
  id?: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  isEmailVerified: boolean;

  @Transform(({ value }) => ('' + value).toUpperCase())
  @IsEnum(UserRole)
  role: UserRole;
}

class UserEntity extends Model<IUser> implements IUser {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public isEmailVerified!: boolean;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(UserRole),
      allowNull: false,
      defaultValue: UserRole.USER,
    },
  },
  {
    sequelize,
    modelName: 'User',
  },
);

UserEntity.addHook('beforeSave', async (user: UserEntity) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

export default UserEntity;
