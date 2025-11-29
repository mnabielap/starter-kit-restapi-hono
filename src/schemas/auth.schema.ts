import { z } from 'zod';

// Schema for one token
const TokenSchema = z.object({
  token: z.string().openapi({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
  expires: z.string().datetime().openapi({
    example: '2025-12-31T23:59:59.000Z',
  }),
});

// Schema for a pair of tokens (access and refresh)
export const AuthTokensSchema = z.object({
  access: TokenSchema,
  refresh: TokenSchema,
});