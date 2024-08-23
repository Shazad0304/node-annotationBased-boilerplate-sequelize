import { DataTypes, Model } from 'sequelize';

import { TokenTypes } from '@common/constants';

import sequelize from '../db/sequelize';

class TokenEntity extends Model {
  public id!: number;
  public token!: string;
  public userId!: number;
  public type!: TokenTypes;
  public expires!: Date;
  public blacklisted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TokenEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(TokenTypes)),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Token',
  },
);

export default TokenEntity;
