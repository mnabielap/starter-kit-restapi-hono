import { z } from 'zod';

// Schema for a single User object that will be returned in the API response
// Note, there is no password field here for security reasons.
export const UserSchema = z.object({
  id: z.number().openapi({
    example: 1,
  }),
  name: z.string().openapi({
    example: 'John Doe',
  }),
  email: z.string().email().openapi({
    example: 'john.doe@example.com',
  }),
  role: z.enum(['user', 'admin']).openapi({
    example: 'user',
  }),
  is_email_verified: z.union([z.literal(0), z.literal(1)]).openapi({
    description: '0 for false, 1 for true',
    example: 1,
  }),
});

// Schema for paginated User list
export const UserListSchema = z.object({
  results: z.array(UserSchema),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
  totalResults: z.number().int(),
});