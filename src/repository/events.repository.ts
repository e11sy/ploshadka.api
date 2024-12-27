import EventsStorage from '@repository/storage/events.storage.js';
import EventVisitsStorage from '@repository/storage/eventVisits.storage.js';
import Event from '@domain/entities/event.js';

export default class EventsRepository {
  private readonly eventStorage: EventsStorage;

  private readonly eventVisitsStorage: EventVisitsStorage;

  constructor(eventStorage: EventsStorage, eventVisitsStorage: EventVisitsStorage) {
    this.eventStorage = eventStorage;
    this.eventVisitsStorage = eventVisitsStorage;
  }

  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleLimit: Event['peopleLimit'],
    sport: Event['sport'],
    description?: Event['description'],
  ): Promise<Event> {
    return await this.eventStorage.createEvent(courtId, name, peopleLimit, sport,  description);
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.eventStorage.getEventByName(name);
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    return await this.eventStorage.getEventsByCourtId(courtId);
  }

  public async getEventsBySport(sport: Event['sport']): Promise<Event[] | null> {
    return await this.eventStorage.getEventsBySport(sport);
  }

  public async checkEventParticipationStatus(eventId: Event['id'], userId: Event['id']): Promise<boolean> {
    return await this.eventVisitsStorage.checkEventParticipationStatus(eventId, userId);
  }

  public async changeEventParticipationStatus(eventId: Event['id'], userId: Event['id']): Promise<boolean> {
    return await this.eventVisitsStorage.changeEventParticipationStatus(eventId, userId);
  }

  public async getEventParticipantsCount(eventId: Event['id']): Promise<number> {
    return await this.eventVisitsStorage.getEventParticipantsCount(eventId);
  }

  public async getEventsOnCourts(courtIds: Event['courtId'][]): Promise<Event[]> {
    return await this.eventStorage.getEventsOnCourts(courtIds);
  }
}
