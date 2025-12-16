<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PrepareDataMigration extends Command
{
    protected $signature = 'migrate:prepare-old-data {--force : Force the operation without confirmation}';

    protected $description = 'Prepare old database tables for migration by renaming them with _old suffix';

    protected array $tablesToBackup = [
        'users',
        'categories',
        'posts',
        'extras',
        'galleries',
        'gallery_items',
        'media',
        'staff',
        'slides',
        'sliders',
        'settings',
        'announcements',
        'facilities',
    ];

    public function handle(): int
    {
        $this->info('🔄 Preparing old data for migration...');
        $this->newLine();

        if (!$this->option('force') && !$this->confirm('This will rename existing tables with _old suffix. Continue?')) {
            $this->warn('Migration preparation cancelled.');
            return 0;
        }

        $backedUp = 0;
        $skipped = 0;

        foreach ($this->tablesToBackup as $table) {
            if (Schema::hasTable($table)) {
                $oldTableName = $table . '_old';

                // Drop old backup if exists
                if (Schema::hasTable($oldTableName)) {
                    $this->warn("  ⚠ Table {$oldTableName} already exists. Dropping...");
                    Schema::drop($oldTableName);
                }

                // Rename current table to _old
                DB::statement("RENAME TABLE `{$table}` TO `{$oldTableName}`");
                $this->info("  ✓ Backed up: {$table} → {$oldTableName}");
                $backedUp++;
            } else {
                $this->comment("  - Skipped: {$table} (not found)");
                $skipped++;
            }
        }

        $this->newLine();
        $this->info("✅ Backup complete!");
        $this->info("  • Tables backed up: {$backedUp}");
        $this->info("  • Tables skipped: {$skipped}");
        $this->newLine();
        $this->info('Next steps:');
        $this->info('  1. Run: php artisan migrate:fresh');
        $this->info('  2. Run: php artisan db:seed --class=OldDataMigrationSeeder');

        return 0;
    }
}
