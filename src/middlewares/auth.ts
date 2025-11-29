import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import { ApiError } from '@/utils/ApiError';
import { roleRights } from '@/config/roles';
import * as userService from '@/services/user.service';
import { tokenTypes } from '@/config/tokens';

export const auth = (...requiredRights: string[]): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const authHeader = c.req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Bearer token not found');
      }
      const token = authHeader.substring(7);

      // 1. Verify signature and token validity period
      const payload = await verify(token, c.env.JWT_SECRET);
      if (typeof payload.sub !== 'number' || payload.type !== tokenTypes.ACCESS) {
        throw new ApiError(401, 'Invalid token type');
      }
      
      // 2. Check if the user exists in the database
      const user = await userService.getUserById(c.env.DB, payload.sub);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      // 3. Save the user into the context for use by the next handler.
      c.set('user', user);

      // 4. Check access rights (role-based authorization)
      if (requiredRights.length > 0) {
        const userRights = roleRights.get(user.role) || [];
        const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));
        if (!hasRequiredRights && c.req.param('userId') !== user.id.toString()) {
          // Allow users to manage themselves even if they have no rights, except for get all users
          if (requiredRights.includes('getUsers')) {
             throw new ApiError(403, 'Forbidden');
          }
        } else if (!hasRequiredRights) {
           throw new ApiError(403, 'Forbidden');
        }
      }
    } catch (e) {
      // Catch all types of authentication errors (expired, invalid signature, user not found, etc.)
      // and return them as a single, consistent error message.
      const errorMessage = e instanceof ApiError ? e.message : 'Please authenticate';
      throw new ApiError(401, errorMessage);
    }

    await next();
  };
};