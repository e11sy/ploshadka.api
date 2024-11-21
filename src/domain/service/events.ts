import EventRepository from '@repository/events.repository.js'
import Event from '@domain/entities/event.js';

export default class EventService {
  public eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  public async createEvent(courtId: Event['courtId'], name: Event['name'], time: Event['time'], description?: Event['description']): Promise<Event> {
    return await this.eventRepository.createEvent(courtId, name, time, description);
  }

  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.eventRepository.getEventByName(name);
  }

  public async getEventsByCourtId(courtId: Event['courtId']): Promise<Event[]> {
    return await this.eventRepository.getEventsByCourtId(courtId);
  }
}
