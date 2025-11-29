import { OpenAPIHono } from '@hono/zod-openapi';
import authRoutes from './auth.route';
import userRoutes from './user.route';

const app = new OpenAPIHono();

app.route('/auth', authRoutes);
app.route('/users', userRoutes);

export default app;