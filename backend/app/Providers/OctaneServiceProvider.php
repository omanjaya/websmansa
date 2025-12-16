<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class OctaneServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Register Octane-specific services
    }

    public function boot(): void
    {
        // Configure Octane-specific settings
        if (config('octane.server') === 'swoole') {
            // Optimize for Swoole
            ini_set('memory_limit', '512M');
            ini_set('max_execution_time', '60');
        }
    }
}
