import { z } from 'zod';
import { password } from './custom.validation';

const userIdParam = z.object({
  userId: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: "User ID must be a number",
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: password,
    role: z.enum(['user', 'admin']),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(),
    sortBy: z.string().optional(),
    limit: z.coerce.number().int().min(1).optional(),
    page: z.coerce.number().int().min(1).optional(),
  }),
});

export const getUserSchema = z.object({
  params: userIdParam
});

export const updateUserSchema = z.object({
  params: userIdParam,
  body: z.object({
      email: z.string().email().optional(),
      password: password.optional(),
      name: z.string().optional(),
      role: z.enum(['user', 'admin']).optional(),
    })
    .partial() // Memastikan semua field di dalam adalah opsional
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Update body must have at least one field',
    }),
});

export const deleteUserSchema = z.object({
    params: userIdParam
});