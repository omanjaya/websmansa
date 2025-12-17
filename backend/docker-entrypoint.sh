#!/bin/bash
set -e

echo "Starting SMANSA Backend..."

# Wait for database to be ready (if needed)
echo "Waiting for database connection..."
sleep 5

# Clear and cache config (requires APP_KEY)
echo "Caching configuration..."
php artisan config:clear
php artisan config:cache

# Cache routes
echo "Caching routes..."
php artisan route:clear
php artisan route:cache

# Cache views
echo "Caching views..."
php artisan view:cache

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

echo "Starting PHP server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
