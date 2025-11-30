# Hono REST API Starter Kit

A complete and ready-to-use REST API starter kit, built with Hono on Cloudflare Workers. This project is integrated with Cloudflare D1 for the database, Zod for validation, and OpenAPI for automated documentation.

## ✨ Key Features

-   **Modern Framework:** Built with [Hono](https://hono.dev/), a very fast and lightweight web framework for edge platforms.
-   **Cloudflare Platform:** Optimized to run on Cloudflare Workers, with [D1](https://developers.cloudflare.com/d1/) database (SQLite-based).
-   **Validation & Schema:** Uses [Zod](https://zod.dev/) for request validation and defining robust data schemas.
-   **Automated API Documentation:** [Swagger UI](https://swagger.io/tools/swagger-ui/) documentation is generated automatically from your code thanks to `@hono/zod-openapi`.
-   **Authentication & Authorization:** Secure JWT-based authentication system (Access & Refresh Token) is built-in, complete with role-based access control (user and admin).
-   **Complete User Management:** CRUD features for users, including registration, login, profile updates, and user management by admins.
-   **Security:** Includes `secureHeaders` middleware and configurable `CORS`.
-   **Docker Ready:** Docker configuration included for running a consistent and portable production environment with persistent data.
-   **Clear Project Structure:** Follows a well-organized directory structure for ease of development and maintenance.

## Prerequisites

Before starting, ensure you have installed the following software:
-   [Node.js](https://nodejs.org/) (version 22 or newer)
-   [npm](https://www.npmjs.com/) (usually installed with Node.js)
-   [Docker](https://www.docker.com/products/docker-desktop/) (only if you want to run via Docker)

---

## 🚀 Getting Started

There are two ways to run this project: locally for development or using Docker for a more isolated and production-like environment.

### Method 1: Local Development (Without Docker)

This is the standard way to develop and test applications on your local machine.

**1. Clone Repository**
```bash
git clone https://github.com/mnabielap/starter-kit-restapi-hono.git
cd starter-kit-restapi-hono
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Wrangler uses the `.dev.vars` file for local environment variables. Create a new file named `.dev.vars` in the project root and fill it with variables from `wrangler.jsonc`.

Create `.dev.vars` file:
```
# .dev.vars

JWT_SECRET="this_is_a_very_secure_and_very_long_jwt_secret_for_development"
JWT_ACCESS_EXPIRATION_MINUTES="30"
JWT_REFRESH_EXPIRATION_DAYS="30"
JWT_RESET_PASSWORD_EXPIRATION_MINUTES="10"
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES="10"
```

**4. Setup & Seed Local D1 Database**
Run the following commands to create table schemas and populate initial data (if any) in your local D1 database.
```bash
# Create tables (users, tokens)
npm run db:schema

# Populate initial data from src/db/seed.sql
npm run db:seed
```

**5. Run Development Server**
```bash
npm run dev
```
The server is now running at `http://localhost:5173`. Changes to the code will automatically reload the server.

### Method 2: Running with Docker

This method wraps the application and its database in a container, ensuring a consistent environment and persistent D1 data.

**1. Create Environment File for Docker**
Create a file named `.env.docker` in the project root. This file will be loaded into the container.
```
# .env.docker

JWT_SECRET="this_is_a_very_secure_and_very_long_jwt_secret_for_development_in_docker"
JWT_ACCESS_EXPIRATION_MINUTES="30"
JWT_REFRESH_EXPIRATION_DAYS="30"
JWT_RESET_PASSWORD_EXPIRATION_MINUTES="10"
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES="10"
```

**2. Create Docker Network & Volumes**
This step only needs to be done once. It ensures communication between containers (if any) and data persistence.
```bash
# Create network
docker network create restapi_hono_network

# Create volume for D1 database
docker volume create restapi_hono_db_volume

# Create volume for media files (if using upload features)
docker volume create restapi_hono_media_volume
```

**3. Build Docker Image**
This command will read the `Dockerfile` and build your application image.
```bash
docker build -t restapi-hono-app .
```

**4. Run Docker Container**
This command will start the container from the image you have built.
```bash
docker run -d -p 5005:5005 \
  --env-file .env.docker \
  -v restapi_hono_db_volume:/app/.wrangler/d1 \
  -v restapi_hono_media_volume:/app/media \
  --network restapi_hono_network \
  --name restapi-hono-container \
  restapi-hono-app
```
The server is now running at `http://localhost:5005`. Your D1 data will be safe inside `restapi_hono_db_volume`.

---

## 📖 API Documentation (Swagger)

Once the server is running (either locally or via Docker), you can access interactive API documentation via Swagger UI.

-   Open your browser and navigate to `http://localhost:<PORT>/ui`
    -   Replace `<PORT>` with `5173` if running locally.
    -   Replace `<PORT>` with `5005` if running via Docker.

---

## 🐳 Docker Container Management

Here are some basic commands to manage your Docker containers.

#### View logs from the running container
```bash
docker logs -f restapi-hono-container
```

#### Stop the container
```bash
docker stop restapi-hono-container
```

#### Restart an existing container
```bash
docker start restapi-hono-container
```

#### Remove the container (after stopping)
```bash
docker rm restapi-hono-container
```

#### List existing volumes
```bash
docker volume ls
```

#### Remove a volume
> **WARNING:** This command will permanently delete your D1 database or media data if the container is not running! Use with caution.
```bash
docker volume rm restapi_hono_db_volume
docker volume rm restapi_hono_media_volume
```

---

## 🧪 API Testing (Python Scripts)

Instead of using Postman, we provide a suite of Python scripts in the `api_tests/` folder. These scripts automatically handle token management (saving/loading `access_token` to `secrets.json`).

### 1. Running Tests
Run the scripts in the following order to simulate a user flow. No arguments are needed.

1.  **Register Admin:**
    ```bash
    python api_tests/A1.auth_register.py
    ```
    *Creates a user and saves tokens to `secrets.json`.*

2.  **Create User:**
    ```bash
    python api_tests/B1.user_create.py
    ```
    *Uses the saved Admin Token to create a new user.*

3.  **Get All Users:**
    ```bash
    python api_tests/B2.user_get_all.py
    ```

> **Note:** The `utils.py` script generates detailed logs for every request in `response.json` (or specific output files defined in the scripts).

---

## 📜 Available NPM Scripts

-   `npm run dev`: Runs the development server with hot-reloading.
-   `npm run build`: Builds the application for production.
-   `npm run preview`: Runs the built application, similar to the production environment. (Used inside Docker).
-   `npm run deploy`: Builds and deploys the application to Cloudflare Pages.
-   `npm run cf-typegen`: Generates TypeScript types from `wrangler.jsonc` configuration.
-   `npm run db:schema`: Runs the `src/db/schema.sql` file on local D1.
-   `npm run db:seed`: Runs the `src/db/seed.sql` file on local D1.

---

## 🏗️ Project Structure

```
/
├── src/
│   ├── config/         # Application configuration (roles, tokens)
│   ├── controllers/    # Request/response logic (e.g., auth.controller.ts)
│   ├── db/             # Database schema and initial data (schema.sql, seed.sql)
│   ├── middlewares/    # Hono Middlewares (auth, errorHandler)
│   ├── repositories/   # Raw database operations (SQL queries)
│   ├── routes/         # API route definitions and OpenAPI documentation
│   ├── schemas/        # Zod schemas for API responses (OpenAPI)
│   ├── services/       # Core business logic (user.service.ts)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions (ApiError, pick)
│   └── index.ts        # Main Hono application entry point
├── .env.docker         # Environment variables for Docker
├── .dockerignore       # Files ignored by Docker
├── Dockerfile          # Instructions to build Docker image
├── entrypoint.sh       # Script executed when Docker container starts
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── wrangler.jsonc      # Cloudflare Wrangler configuration
```