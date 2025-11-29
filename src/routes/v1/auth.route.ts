import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import * as authController from '@/controllers/auth.controller';
import { auth } from '@/middlewares/auth';
import {
    registerSchema,
    loginSchema,
    logoutSchema,
    refreshTokensSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
} from '@/validations/auth.validation';
import { AuthTokensSchema, UserSchema } from '@/schemas'; 

const app = new OpenAPIHono();

app.openapi(createRoute({
    method: 'post', path: '/register',
    middleware: [zValidator('json', registerSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: registerSchema.shape.body } } } },
    responses: { 201: { description: 'Created', content: { 'application/json': { schema: z.object({ user: UserSchema, tokens: AuthTokensSchema }) } } } },
    summary: 'Register as user', tags: ['Auth']
  }), authController.register
);

app.openapi(createRoute({
    method: 'post', path: '/login',
    middleware: [zValidator('json', loginSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: loginSchema.shape.body } } } },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: z.object({ user: UserSchema, tokens: AuthTokensSchema }) } } } },
    summary: 'Login', tags: ['Auth']
  }), authController.login
);

app.openapi(createRoute({
    method: 'post', path: '/logout',
    middleware: [zValidator('json', logoutSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: logoutSchema.shape.body } } } },
    responses: { 204: { description: 'No Content' } },
    summary: 'Logout', tags: ['Auth']
  }), authController.logout
);

app.openapi(createRoute({
    method: 'post', path: '/refresh-tokens',
    middleware: [zValidator('json', refreshTokensSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: refreshTokensSchema.shape.body } } } },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: AuthTokensSchema } } } },
    summary: 'Refresh auth tokens', tags: ['Auth']
  }), authController.refreshTokens
);

app.openapi(createRoute({
    method: 'post', path: '/forgot-password',
    middleware: [zValidator('json', forgotPasswordSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: forgotPasswordSchema.shape.body } } } },
    responses: { 204: { description: 'No Content' } },
    summary: 'Forgot password', description: 'An email would be sent to reset password.', tags: ['Auth']
  }), authController.forgotPassword
);

app.openapi(createRoute({
    method: 'post', path: '/reset-password',
    middleware: [
        zValidator('query', resetPasswordSchema.shape.query),
        zValidator('json', resetPasswordSchema.shape.body)
    ],
    request: { query: resetPasswordSchema.shape.query, body: { content: { 'application/json': { schema: resetPasswordSchema.shape.body } } } },
    responses: { 204: { description: 'No Content' } },
    summary: 'Reset password', tags: ['Auth']
  }), authController.resetPassword
);

app.openapi(createRoute({
    method: 'post', path: '/send-verification-email',
    middleware: [auth()],
    responses: { 204: { description: 'No Content' } },
    summary: 'Send verification email', description: 'An email would be sent to verify email.', tags: ['Auth'], security: [{ bearerAuth: [] }]
  }), authController.sendVerificationEmail
);

app.openapi(createRoute({
    method: 'post', path: '/verify-email',
    middleware: [zValidator('query', verifyEmailSchema.shape.query)],
    request: { query: verifyEmailSchema.shape.query },
    responses: { 204: { description: 'No Content' } },
    summary: 'Verify email', tags: ['Auth']
  }), authController.verifyEmail
);

export default app;