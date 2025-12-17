<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Skip for SQLite and PostgreSQL - this migration uses MySQL-specific syntax
        // For fresh PostgreSQL deployments, the schema is already correct from create_extras_table
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite' || $driver === 'pgsql') {
            return;
        }

        // Step 1: Set default category for NULL values before converting to ENUM
        DB::statement("
            UPDATE extras
            SET category = CASE
                WHEN category IS NULL OR category = '' THEN 'sports'
                WHEN category NOT IN ('sports', 'arts', 'academic', 'social', 'technology', 'language', 'leadership', 'volunteer', 'religious') THEN 'sports'
                ELSE category
            END
        ");

        // Step 2: Convert category from varchar to ENUM
        // Note: We keep it nullable in case there are issues, but set a default
        DB::statement("
            ALTER TABLE extras
            MODIFY category ENUM('sports', 'arts', 'academic', 'social', 'technology', 'language', 'leadership', 'volunteer', 'religious')
            NULL DEFAULT 'sports'
        ");

        // Step 3: Convert requirements from text to JSON
        if (Schema::hasColumn('extras', 'requirements')) {
            DB::statement('ALTER TABLE extras MODIFY requirements JSON NULL');

            DB::statement("
                UPDATE extras
                SET requirements = CASE
                    WHEN requirements IS NULL OR requirements = '' THEN '[]'
                    WHEN requirements NOT LIKE '[%' AND requirements NOT LIKE '{%' THEN JSON_ARRAY(requirements)
                    ELSE requirements
                END
            ");
        }

        // Step 4: Convert schedule from longtext to varchar(255)
        if (Schema::hasColumn('extras', 'schedule')) {
            // First truncate any values longer than 255 characters
            DB::statement("
                UPDATE extras
                SET schedule = LEFT(schedule, 255)
                WHERE LENGTH(schedule) > 255
            ");

            DB::statement('ALTER TABLE extras MODIFY schedule VARCHAR(255) NULL');
        }

        // Step 5: Convert images from longtext to JSON
        if (Schema::hasColumn('extras', 'images')) {
            DB::statement('ALTER TABLE extras MODIFY images JSON NULL');

            DB::statement("
                UPDATE extras
                SET images = CASE
                    WHEN images IS NULL OR images = '' THEN '[]'
                    WHEN images NOT LIKE '[%' AND images NOT LIKE '{%' THEN JSON_ARRAY(images)
                    ELSE images
                END
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: Reverting ENUM to varchar and JSON to text is complex
        // and would require careful data handling
        // For safety, we don't implement a full rollback here
    }
};
