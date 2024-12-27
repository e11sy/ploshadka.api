import Court from './court.js';

export default interface Event {
  /**
   * Event internal id
   */
  id: number,

  /**
   * Id of court, where evert is based
   */
  courtId: Court['id'],

  /**
   * Name of the event
   */
  name: string,

  /**
   * Description of the event
   */
  description: string,

  /**
   * Sport type
   */
  sport: string,

  /**
   * How many people already participate in the event and how many people can participate
   */
  peopleLimit: number,

  /**
   * Date when event will be closed
   */
  expires_at: Date,
}

export interface EventPresentation extends Event{
  /**
   * How many people already participate in the event
   */
  peopleCount: number,

  /**
   * Is user participating in the event
   */
  isParticipating?: boolean,
}
