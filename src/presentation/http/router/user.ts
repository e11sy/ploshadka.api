import type { FastifyPluginCallback } from 'fastify';
import type UserService from '@domain/service/user.js';
import type User from '@domain/entities/user.js';

/**
 * Interface for the user router
 */
interface UserRouterOptions {
  /**
   * User service instance
   */
  userService: UserService,
}

/**
 * Manages user
 *
 * @param fastify - fastify instance
 * @param opts - empty options
 * @param done - callback
 */
const UserRouter: FastifyPluginCallback<UserRouterOptions> = (fastify, opts, done) => {
  /**
   * Manage user data
   */
  const userService = opts.userService;

  /**
   * Get user by session
   */
  fastify.get<{
    Reply: Pick<User, 'id' | 'name' | 'email' >,
  }>('/myself', {
    config: {
      policy: [
        'authRequired',
      ],
    },
  }, async (request, reply) => {
    const userId = request.userId as number;

    const user = await userService.getUserById(userId);

    if (user === null) {
      return reply.notFound('User not found');
    }

    return reply.send(user);
  });
  done();
};

export default UserRouter;
