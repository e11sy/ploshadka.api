import EventRepository from '@repository/events.repository.js'
import Event from '@domain/entities/event.js';

export default class EventService {
  public eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleState: Event['peopleState'],
    sport: Event['sport'],
    description?: Event['description'],
    visited?: Event['visited'],
  ): Promise<Event> {
    return await this.eventRepository.createEvent(courtId, name, peopleState, sport, description, visited);
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    console.log('get event by name triggered wtf')
    return await this.eventRepository.getEventByName(name);
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    return await this.eventRepository.getEventsByCourtId(courtId);
  }

  public async getEventBySport(sport: Event['sport']): Promise<Event[] | null> {
    return await this.eventRepository.getEventBySport(sport);
  }

  public async getMyEvents(): Promise<Event[]> {
    return await this.eventRepository.getMyEvents();
  }
}
