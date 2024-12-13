import EventsStorage from '@repository/storage/events.storage.js'
import Event from '@domain/entities/event.js';

export default class EventsRepository {
  public storage: EventsStorage;

  constructor(storage: EventsStorage) {
    this.storage = storage;
  }

  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleState: Event['peopleState'],
    sport: Event['sport'],
    description?: Event['description'],
    visited?: Event['visited'],
  ): Promise<Event> {
    return await this.storage.createEvent(courtId, name, peopleState, sport,  description, visited);
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.storage.getEventByName(name);
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    return await this.storage.getEventsByCourtId(courtId);
  }

  public async getEventBySport(sport: Event['sport']): Promise<Event[] | null> {
    return await this.storage.getEventBySport(sport);
  }

  public async getMyEvents(): Promise<Event[]> {
    return await this.storage.getMyEvents();
  }
}
