#!/bin/sh
set -e
echo "--- Menjalankan Migrasi Database (Schema) ---"
npx wrangler d1 execute starter-kit-restapi-hono-db --file=./src/db/schema.sql --local
# echo "--- Running Seeding Database ---"
# npx wrangler d1 execute starter-kit-restapi-hono-db --file=./src/db/seed.sql --local
echo "--- Migrasi & Seeding Selesai. Memulai Server... ---"
exec npx wrangler pages dev dist --port=5005 --ip=0.0.0.0