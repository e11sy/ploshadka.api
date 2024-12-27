import CourtsService from '@domain/service/courts.js';
import type { FastifyPluginCallback } from 'fastify';
import Court from '@domain/entities/court.js';

interface CourtsRouterOptions {
  courtsService: CourtsService;
}

const CourtsRouter: FastifyPluginCallback<CourtsRouterOptions> = (fastify, opts, done) => {
  const courtsService = opts.courtsService;

  fastify.get<{
    Reply: Court[],
  }>('/all', async (_request, reply) => {
    const courts = await courtsService.getAllCourts();

    return reply.send(courts);
  });

  done();
}

export default CourtsRouter;
