import type { Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Court from '@domain/entities/court.js';
import { Model, DataTypes } from 'sequelize';
import type Orm from '@repository/storage/postgres/orm/sequelize/index.js';
import { sequelize } from '../../export/initSequelize.js';

export class CourtsModel extends Model<InferAttributes<CourtsModel>, InferCreationAttributes<CourtsModel>> {
  public declare id: CreationOptional<number>;

  public declare name: Court['name'];

  public declare description: Court['description'];

  public declare location: Court['location'];
}

export default class CourtsSequelizeStorage {
  public model: typeof CourtsModel;

  private readonly database = sequelize;

  private readonly tableName = 'courts';

  constructor({ connection }: Orm) {
    this.database = connection;

    this.model = CourtsModel.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: this.tableName,
      timestamps: false,
      sequelize: this.database,
    })
  };

  /**
   * Get all available courts
   */
  public async getAllCourts(): Promise<Court[]> {
    return this.model.findAll();
  }
}
