import { Sequelize } from 'sequelize-typescript';

import { sequelizeConfig } from '../config';

const sequelize = new Sequelize(sequelizeConfig);

sequelize.addModels([__dirname + '/models']);

export default sequelize;
