import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import * as userController from '@/controllers/user.controller';
import { auth } from '@/middlewares/auth';
import {
    createUserSchema,
    getUsersSchema,
    getUserSchema,
    updateUserSchema,
    deleteUserSchema
} from '@/validations/user.validation';
import { UserSchema, UserListSchema } from '@/schemas';

const app = new OpenAPIHono();

app.use('*', async (c, next) => {
    app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
    });
    await next();
});

app.openapi(createRoute({
    method: 'post', path: '/',
    middleware: [auth('manageUsers'), zValidator('json', createUserSchema.shape.body)],
    request: { body: { content: { 'application/json': { schema: createUserSchema.shape.body } } } },
    responses: { 201: { description: 'Created', content: { 'application/json': { schema: UserSchema } } } },
    summary: 'Create a user', description: 'Only admins can create users.', tags: ['Users'], security: [{ bearerAuth: [] }]
  }), userController.createUser
);

app.openapi(createRoute({
    method: 'get', path: '/',
    middleware: [auth('getUsers'), zValidator('query', getUsersSchema.shape.query)],
    request: { query: getUsersSchema.shape.query },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: UserListSchema } } } },
    summary: 'Get all users', description: 'Only admins can retrieve all users.', tags: ['Users'], security: [{ bearerAuth: [] }]
  }), userController.getUsers
);

app.openapi(createRoute({
    method: 'get', path: '/{userId}',
    middleware: [auth('getUsers'), zValidator('param', getUserSchema.shape.params)],
    request: { params: getUserSchema.shape.params },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: UserSchema } } } },
    summary: 'Get a user', description: 'Logged in users can fetch their own user information. Admins can fetch any.', tags: ['Users'], security: [{ bearerAuth: [] }]
  }), userController.getUser
);

app.openapi(createRoute({
    method: 'patch', path: '/{userId}',
    middleware: [
        auth('manageUsers'),
        zValidator('param', updateUserSchema.shape.params),
        zValidator('json', updateUserSchema.shape.body)
    ],
    request: { params: updateUserSchema.shape.params, body: { content: { 'application/json': { schema: updateUserSchema.shape.body } } } },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: UserSchema } } } },
    summary: 'Update a user', description: 'Logged in users can only update their own information. Admins can update any.', tags: ['Users'], security: [{ bearerAuth: [] }]
  }), userController.updateUser
);

app.openapi(createRoute({
    method: 'delete', path: '/{userId}',
    middleware: [auth('manageUsers'), zValidator('param', deleteUserSchema.shape.params)],
    request: { params: deleteUserSchema.shape.params },
    responses: { 204: { description: 'No Content' } },
    summary: 'Delete a user', description: 'Logged in users can delete only themselves. Admins can delete any.', tags: ['Users'], security: [{ bearerAuth: [] }]
  }), userController.deleteUser
);

export default app;