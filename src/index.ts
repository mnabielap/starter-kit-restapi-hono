// 1. Import OpenAPI Hono, not regular Hono
import { OpenAPIHono } from '@hono/zod-openapi'; 
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { swaggerUI } from '@hono/swagger-ui';
import { logger as honoLogger } from 'hono/logger'

import { errorHandler } from '@/middlewares/errorHandler';
import v1Routes from '@/routes/v1';

// 2. Create an instance of OpenAPIHono
const app = new OpenAPIHono();

// --- Middleware Global ---
app.use('*', honoLogger());
app.use('*', cors({
  origin: '*', // Allow all origins. For production, replace with your frontend domain, e.g.: 'https://my-app.com'
  allowHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  maxAge: 600, // Caching duration for preflight requests (in seconds)
}));
app.use('*', secureHeaders());

// --- Routing ---
// Redirect root to API documentation
app.get('/', (c) => c.redirect('/ui'));

// V1 API Routes
app.route('/v1', v1Routes);

// --- OpenAPI Documentation (Swagger) ---
app.doc('/v1/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hono API Starter Kit by mnabielap (https://github.com/mnabielap)',
    description: 'A full-featured REST API starter kit built with Hono, Cloudflare D1, and Zod by mnabielap (https://github.com/mnabielap).',
  },
  servers: [
    { url: 'http://localhost:5173', description: 'Localhost' },
    { url: 'https://starter-kit-restapi-hono.pages.dev', description: 'Production' },
  ],
});

app.get('/ui', swaggerUI({ url: '/v1/openapi.json' }));


// --- Error Handling ---
app.notFound((c) => {
  return c.json({ code: 404, message: 'Not Found' }, 404);
});

app.onError(errorHandler);

export default app;