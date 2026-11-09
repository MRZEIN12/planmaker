#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
    export DB_URL="$DATABASE_URL"
    export DB_CONNECTION="${DB_CONNECTION:-pgsql}"
fi

php artisan migrate --force
exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
