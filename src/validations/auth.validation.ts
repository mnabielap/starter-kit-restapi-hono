import { z } from 'zod';
import { password } from './custom.validation';

export const registerSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: password,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const refreshTokensSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export const resetPasswordSchema = z.object({
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: password,
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string(),
  }),
});