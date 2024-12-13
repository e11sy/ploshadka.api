import EventService from "@domain/service/events.js";
import type { FastifyPluginCallback, RawServerDefault } from 'fastify';
import Event from "@domain/entities/event.js";

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
            'peopleState',
            'description',
          ],
          properties: {
            name: {
              type: 'string',
            },
            courtId: {
              type: 'number',
            },
            peopleState: {
              type: 'array',
              items: {
                type: 'number',
              },
            },
            description: {
              type: 'string',
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    console.log('booooody', request.body, typeof request.body, request.body);

    const { name, courtId, peopleState, description } = request.body.event;

    const event = await eventService.createEvent(courtId, name, peopleState, description);

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
    Reply: Event[],
  }>('/sport/:sport', async ( request, reply ) => {
    const sport = decodeURIComponent(request.params.sport);

    const event = await eventService.getEventBySport(sport);

    if (event === null) {
      return reply.notFound('No events for this kind of sport');
    }

    return reply.send(event);
  })

  fastify.get<{
    Reply: Event[],
  }>('/my', async ( _request, reply ) => {
    const events = await eventService.getMyEvents();

    return reply.send(events);
  });

  fastify.get<{
    Params: { courtId: Event['courtId']},
    Reply: Event[];
  }>('/court/:courtId', async ( request, reply ) => {
    const courtId = request.params.courtId;

    const events = await eventService.getEventsByCourtId(courtId);

    return reply.send(events);
  });

  done();
}

export default EventsRouter;
