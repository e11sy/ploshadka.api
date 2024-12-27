import EventRepository from '@repository/events.repository.js'
import Event, { EventPresentation } from '@domain/entities/event.js';
import User from '@domain/entities/user.js';

export default class EventService {
  public eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  /**
   * Method that creates event
   * @param courtId - id of the court where event will happen
   * @param name - name of the event
   * @param peopleLimit - limit of people that can participate in event
   * @param sport - sport of the event
   * @param description - description of the event
   */
  public async createEvent(
    courtId: Event['courtId'],
    name: Event['name'],
    peopleLimit: Event['peopleLimit'],
    sport: Event['sport'],
    description?: Event['description'],
  ): Promise<Event> {
    return await this.eventRepository.createEvent(courtId, name, peopleLimit, sport, description);
  }

  /**
   * Method that returns event by name
   * @param name - name of event to get
   */
  public async getEventByName(name: Event['name']): Promise<Event | null>{
    return await this.eventRepository.getEventByName(name);
  }

  /**
   * Method that returns events by court id
   * @param courtId - id of court to get events
   */
  public async getEventsByCourtId(courtId: Event['courtId']): Promise<EventPresentation[]> {
    const events =  await this.eventRepository.getEventsByCourtId(courtId);

    const eventPresentations: EventPresentation[] = [];

    events.forEach(async (event) => {
      eventPresentations.push({
        ...event,
        peopleCount: await this.eventRepository.getEventParticipantsCount(event.id),
      });
    });

    return eventPresentations;
  }

  /**
   * Method that returns events by sport
   * @param sport - sport to get events
   */
  public async getEventsBySport(sport: Event['sport']): Promise<EventPresentation[]> {
    const events =  await this.eventRepository.getEventsBySport(sport);

    let eventPresentations: EventPresentation[] = [];

    for (const event of events!) {
      eventPresentations.push({
        ...event,
        peopleCount: await this.eventRepository.getEventParticipantsCount(event.id),
      });
    }

    return eventPresentations;
  }

  /**
   * Method that checks if user is participating in event
   * @param eventId - id of event to check
   * @param userId - id of user to check
   */
  public checkEventParticipationStatus(eventId: Event['id'], userId: User['id']): Promise<boolean> {
    return this.eventRepository.checkEventParticipationStatus(eventId, userId);
  }

  /**
   * Method that changes user participation status in event
   * @param eventId - id of event to change participation status
   * @param userId - id of user to change participation status
   */
  public async changeEventParticipationStatus(eventId: Event['id'], userId: User['id']): Promise<boolean> {
    return await this.eventRepository.changeEventParticipationStatus(eventId, userId);
  }

  /**
   * Method that returns events on courts
   * @param courtIds - ids of courts to get events
   */
  public async getEventsOnCourts(courtIds: Event['courtId'][]): Promise<EventPresentation[]> {
    const events = await this.eventRepository.getEventsOnCourts(courtIds);

    const eventPresentations: EventPresentation[] = [];

    for (const event of events) {
      eventPresentations.push({
        ...event,
        peopleCount: await this.eventRepository.getEventParticipantsCount(event.id),
      });
    }

    return eventPresentations;
  }
}
