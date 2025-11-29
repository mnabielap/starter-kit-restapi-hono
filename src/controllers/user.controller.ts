import * as userService from '@/services/user.service';
import { ApiError } from '@/utils/ApiError';
import { pick } from '@/utils/pick';

export const createUser = async (c: any) => {
  const body = c.req.valid('json');
  const user = await userService.createUser(c.env.DB, body);
  return c.json(user, 201);
};

export const getUsers = async (c: any) => {
  const query = c.req.valid('query');
  const filter = pick(query, ['name', 'role']);
  const options = pick(query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(c.env.DB, filter, options);
  return c.json(result);
};

export const getUser = async (c: any) => {
  const { userId } = c.req.valid('param');
  const user = await userService.getUserById(c.env.DB, parseInt(userId, 10));
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return c.json(user);
};

export const updateUser = async (c: any) => {
  const { userId } = c.req.valid('param');
  const body = c.req.valid('json');
  const user = await userService.updateUserById(c.env.DB, parseInt(userId, 10), body);
  return c.json(user);
};

export const deleteUser = async (c: any) => {
  const { userId } = c.req.valid('param');
  await userService.deleteUserById(c.env.DB, parseInt(userId, 10));
  return c.body(null, 204);
};