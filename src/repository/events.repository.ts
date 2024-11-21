import EventsStorage from '@repository/storage/events.storage.js'
import Event from '@domain/entities/event.js';

export default class EventsRepository {
  public storage: EventsStorage;

  constructor(storage: EventsStorage) {
    this.storage = storage;
  }

  public async createEvent(courtId: Event['courtId'], name: Event['name'], time: Event['time'], description?: Event['description']): Promise<Event> {
    return await this.storage.createEvent(courtId, name, time, description);
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.storage.getEventByName(name);
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    return await this.storage.getEventsByCourtId(courtId);
  }
}
