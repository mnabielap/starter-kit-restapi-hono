import 'hono'
import { User } from '@/models/user.model';

// Cloudflare bindings
type CloudflareBindings = {
    DB: D1Database;
    JWT_SECRET: string;
    JWT_ACCESS_EXPIRATION_MINUTES: string;
    JWT_REFRESH_EXPIRATION_DAYS: string;
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: string;
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: string;
};

// Variables that we will add to the Hono context
type HonoContextVariables = {
    user: User;
}

declare module 'hono' {
    interface ContextVariableMap extends HonoContextVariables {}
    interface Env {
        Bindings: CloudflareBindings
    }
}