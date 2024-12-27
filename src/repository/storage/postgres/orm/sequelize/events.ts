import type { Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, ModelStatic } from 'sequelize';
import { Op, where } from 'sequelize';
import Event from "@domain/entities/event.js";
import { Model, DataTypes } from 'sequelize';
import type Orm from '@repository/storage/postgres/orm/sequelize/index.js';
import { sequelize } from '../../export/initSequelize.js';
import { CourtsModel } from './courts.js';

export class EventsModel extends Model<InferAttributes<EventsModel>, InferCreationAttributes<EventsModel>> {
  public declare id : CreationOptional<number>;

  public declare courtId: Event['courtId'];

  public declare name: Event['name'];

  public declare description: CreationOptional<Event['description']>;

  public declare peopleLimit: Event['peopleLimit'];

  public declare sport: Event['sport'];

  public declare expires_at: CreationOptional<Event['expires_at']>;
}

export default class EventSequelizeStorage {
  public model: typeof EventsModel;

  public courtsModel: ModelStatic<CourtsModel> | undefined = undefined;

  private readonly database: Sequelize;

  private readonly tableName = 'events';

  constructor({ connection }: Orm) {
    this.database = connection;

    this.model = EventsModel.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      courtId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      peopleLimit: {
        type: DataTypes.INTEGER,
      },
      sport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP + INTERVAL \'1 DAY\''),
      }
    }, {
      tableName: this.tableName,
      timestamps: false,
      sequelize: this.database,
    });
  };

  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleLimit: Event['peopleLimit'],
    sport: Event['sport'],
    description?: Event['description'],
    expires_at?: Event['expires_at']
  ): Promise<Event>{
    return await this.model.create({
      courtId,
      name,
      peopleLimit,
      description,
      sport,
      expires_at: expires_at ?? new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
  }

  /**
   * Creates association with user model
   * @param model - initialized note settings model
   */
  public createAssociationWithCourtsModel(model: ModelStatic<CourtsModel>): void {
    this.courtsModel = model;

    this.model.belongsTo(this.courtsModel, {
      foreignKey: 'courtId',
      as: 'court',
    });
  }

  public async getEventByName(name: Event['name']): Promise<Event | null> {
    return await this.model.findOne({
      where: {
        name,
        expires_at: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: this.courtsModel!,
          as: 'court',
          attributes: ['name']
        },
      ]
    })
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    const events = await this.model.findAll({
      where: {
        courtId,
        expires_at: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: this.courtsModel!,
          as: 'court',
          attributes: ['name']
        },
      ]
    });

    return events ?? [];
  }

  public async getEventsBySport(sport: Event['sport']): Promise<Event[] | null> {
    const events = await this.model.findAll({
      where: {
        sport: sport,
        expires_at: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: this.courtsModel!,
          as: 'court',
          attributes: ['name']
        },
      ]
    });

    const plainEvents = events.map(event => event.get({ plain: true }));

    return plainEvents ?? [];
  }

  public async getEventsOnCourts(courtIds: Event['courtId'][]): Promise<Event[]> {
    const events= await this.model.findAll({
      where: {
        courtId: {
          [Op.in]: courtIds
        },
        expires_at: { [Op.gt]: new Date() }
      },
      limit: 20,
      raw: true,
      nest: true,
      include: [
        {
          model: this.courtsModel!,
          as: 'court',
        },
      ]
    });

    return events;
  }
}
