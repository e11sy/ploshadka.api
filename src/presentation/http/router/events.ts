import EventService from "@domain/service/events.js";
import type { FastifyPluginCallback } from 'fastify';
import Event, { EventPresentation } from "@domain/entities/event.js";

interface EventsRouterOptions {
  eventService: EventService;
}

const EventsRouter: FastifyPluginCallback<EventsRouterOptions> = (fastify, opts, done) => {
  const eventService = opts.eventService;

  fastify.post<{
    Body: {
      event: Event,
    };
    Reply: Event | null;
  }>('/', {
    schema: {
      body: {
        event: {
          type: 'object',
          required: [
            'name',
            'courtId',
            'peopleLimit',
            'sport',
          ],
          properties: {
            name: {
              type: 'string',
            },
            courtId: {
              type: 'number',
            },
            peopleLimit: {
              type: 'number',
            },
            sport: {
              type: 'string',
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { name, courtId, peopleLimit, sport } = request.body.event;

    const event = await eventService.createEvent(courtId, name, peopleLimit, sport);

    return reply.send(event)
  })

  fastify.get<{
    Params: { name: Event['name'] },
    Reply: Event,
  }>('/name/:name', async ( request, reply ) => {
    const name = request.params.name;

    const event = await eventService.getEventByName(name);

    if (event === null) {
      return reply.notFound('Event with this name not found');
    }

    return reply.send(event);
  })

  fastify.get<{
    Params: { sport: Event['sport'] },
    Reply: EventPresentation[],
  }>('/sport/:sport', async ( request, reply ) => {
    const userId = request.userId as number;

    const sport = decodeURIComponent(request.params.sport);

    const events = await eventService.getEventsBySport(sport);

    if (userId !== undefined && userId !== null) {
      for (const event of events) {
        event.isParticipating = await eventService.checkEventParticipationStatus(event.id, userId);
      }
    }

    return reply.send(events);
  })

  fastify.get<{
    Params: { courtId: Event['courtId']},
    Reply: EventPresentation[];
  }>('/court/:courtId', async ( request, reply ) => {
    const userId = request.userId as number;

    const courtId = request.params.courtId;

    const events = await eventService.getEventsByCourtId(courtId);

    if (userId !== undefined && userId !== null) {
      for (const event of events) {
        event.isParticipating = await eventService.checkEventParticipationStatus(event.id, userId);
      }
    }

    return reply.send(events);
  });

  fastify.get<{
    Querystring: { courtIds: string },
    Reply: EventPresentation[],
  }>('/on-courts', async ( request, reply ) => {
    const userId = request.userId as number;

    const courtIds = request.query.courtIds.split(',').map(Number);

    const events = await eventService.getEventsOnCourts(courtIds);

    if (userId !== undefined && userId !== null) {
      for (const event of events) {
        event.isParticipating = await eventService.checkEventParticipationStatus(event.id, userId);
      }
    }

    return reply.send(events);
  });

  fastify.patch<{
    Body: { eventId: Event['id'] },
    Reply: boolean
  }>('/participation',{
    config: {
      policy: [
        'authRequired',
      ],
    },
  },
  async ( request, reply ) => {
    const eventId = request.body.eventId;
    const userId = request.userId as number;

    const success = await eventService.changeEventParticipationStatus(eventId, userId);

    return reply.send(success);
  });

  done();
}

export default EventsRouter;
