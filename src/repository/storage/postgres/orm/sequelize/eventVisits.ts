import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import type Orm from '@repository/storage/postgres/orm/sequelize/index.js';

export class EventVisitsModel extends Model<InferAttributes<EventVisitsModel>, InferCreationAttributes<EventVisitsModel>> {
  public declare id: CreationOptional<number>;

  public declare eventId: number;

  public declare userId: number;
}

export default class EventVisitsSequelizeStorage {
  public model: typeof EventVisitsModel;

  private readonly database: Sequelize;

  private readonly tableName = 'event_visits';

  constructor({ connection }: Orm) {
    this.database = connection;

    this.model = EventVisitsModel.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize: this.database,
      tableName: this.tableName,
      timestamps: false,
    });
  }

  /**
   * Change event participation status
   * @param eventId - id of the event to change status
   * @param userId - id of the user to change status
   */
  public async changeEventParticipationStatus(eventId: number, userId: number): Promise<boolean> {
    const eventVisit = await this.model.findOne({ where: { eventId, userId } });

    if (eventVisit) {
      await eventVisit.destroy();
      return false;
    }

    await this.model.create({ eventId, userId });
    return true;
  }

  public async checkEventParticipationStatus(eventId: number, userId: number): Promise<boolean> {
    return !!(await this.model.findOne({ where: { eventId, userId }}));
  }

  /**
   * Get event participants count
   * @param eventId - id of the event to get participants count
   */
  public async getEventParticipantsCount(eventId: number): Promise<number> {
    return await this.model.count({ where: { eventId } }) ?? 0;
  }
}
