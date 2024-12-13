import type { Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import Event from "@domain/entities/event.js";
import { Model, DataTypes } from 'sequelize';
import type Orm from '@repository/storage/postgres/orm/sequelize/index.js';


export class EventsModel extends Model<InferAttributes<EventsModel>, InferCreationAttributes<EventsModel>> {
  public declare id : CreationOptional<number>;

  public declare courtId: Event['courtId'];

  public declare name: Event['name'];

  public declare description: CreationOptional<Event['description']>;

  public declare peopleState: Event['peopleState'];

  public declare sport: Event['sport'];

  public declare visited: boolean;
}

export default class EventSequelizeStorage {
  public model: typeof EventsModel;

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
      peopleState: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      sport: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    }, {
      tableName: this.tableName,
      timestamps: false,
      sequelize: this.database,
    });
  };

  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleState: Event['peopleState'],
    sport: Event['sport'],
    description?: Event['description'],
    visited?: Event['visited'],
  ): Promise<Event>{
    return await this.model.create({
      courtId,
      name,
      peopleState,
      description,
      sport,
      visited: visited ?? false,
    });
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.model.findOne({
      where: {
        name,
      }
    })
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    const events = await this.model.findAll({
      where: {
        courtId,
      }
    });

    return events ?? [];
  }

  public async getEventBySport(sport: Event['sport']): Promise<Event[] | null> {
    const events = await this.model.findAll({
      where: {
        sport: sport,
      }
    });

    return events ?? [];
  }

  public async getMyEvents(): Promise<Event[]> {
    const events = await this.model.findAll({
      where: {
        visited: true,
      }
    });

    return events ?? [];
  }
}
