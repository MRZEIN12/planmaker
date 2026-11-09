#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ] && [ -z "$DB_URL" ]; then
    export DB_URL="$DATABASE_URL"
    export DB_CONNECTION="${DB_CONNECTION:-pgsql}"
fi

mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

php artisan migrate --force
exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
