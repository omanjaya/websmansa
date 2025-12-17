#!/bin/bash

echo "Starting SMANSA Backend..."

# Function to run setup tasks in background
run_setup() {
    sleep 3  # Brief wait for server to start

    echo "[Setup] Waiting for database connection..."
    for i in {1..30}; do
        if php artisan tinker --execute="DB::connection()->getPdo();" 2>/dev/null; then
            echo "[Setup] Database connected successfully!"
            break
        fi
        echo "[Setup] Waiting for database... attempt $i/30"
        sleep 2
    done

    # Clear and cache config (with error handling)
    echo "[Setup] Caching configuration..."
    php artisan config:clear 2>/dev/null || true
    php artisan config:cache 2>/dev/null || echo "[Setup] Config cache skipped (non-critical)"

    # Cache routes (with error handling)
    echo "[Setup] Caching routes..."
    php artisan route:clear 2>/dev/null || true
    php artisan route:cache 2>/dev/null || echo "[Setup] Route cache skipped (non-critical)"

    # Cache views (with error handling)
    echo "[Setup] Caching views..."
    php artisan view:cache 2>/dev/null || echo "[Setup] View cache skipped (non-critical)"

    # Run migrations (with error handling)
    echo "[Setup] Running migrations..."
    php artisan migrate --force 2>&1 || echo "[Setup] Migration warning (may need manual review)"

    # Create storage link if not exists
    php artisan storage:link 2>/dev/null || true

    echo "[Setup] Background setup completed!"
}

# Start setup in background so server can start immediately
run_setup &

echo "Starting PHP server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
