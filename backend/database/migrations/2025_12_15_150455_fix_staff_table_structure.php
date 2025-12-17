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
        // For fresh PostgreSQL deployments, the schema is already correct
        $driver = DB::connection()->getDriverName();
        if ($driver === 'sqlite' || $driver === 'pgsql') {
            return;
        }

        // Step 1: Add missing columns
        Schema::table('staff', function (Blueprint $table) {
            if (!Schema::hasColumn('staff', 'type')) {
                $table->enum('type', [
                    'teacher', 'admin', 'staff', 'headmaster', 'vice_headmaster',
                    'counselor', 'librarian', 'lab_assistant', 'security',
                    'cleaner', 'cafeteria',
                ])->default('staff')->after('department');
            }

            if (!Schema::hasColumn('staff', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('is_active');
            }
        });

        // Step 2: Convert text/longtext fields to JSON
        // This is done by creating new temp columns, copying data, then swapping

        // Convert subjects (longtext -> JSON)
        if (Schema::hasColumn('staff', 'subjects')) {
            DB::statement('ALTER TABLE staff MODIFY subjects JSON NULL');

            // Fix any non-JSON data
            DB::statement("
                UPDATE staff
                SET subjects = CASE
                    WHEN subjects IS NULL OR subjects = '' THEN '[]'
                    WHEN subjects NOT LIKE '[%' AND subjects NOT LIKE '{%' THEN JSON_ARRAY(subjects)
                    ELSE subjects
                END
            ");
        }

        // Convert qualifications (text -> JSON)
        if (Schema::hasColumn('staff', 'qualifications')) {
            DB::statement('ALTER TABLE staff MODIFY qualifications JSON NULL');

            DB::statement("
                UPDATE staff
                SET qualifications = CASE
                    WHEN qualifications IS NULL OR qualifications = '' THEN '[]'
                    WHEN qualifications NOT LIKE '[%' AND qualifications NOT LIKE '{%' THEN JSON_ARRAY(qualifications)
                    ELSE qualifications
                END
            ");
        }

        // Convert social_media (longtext -> JSON)
        if (Schema::hasColumn('staff', 'social_media')) {
            DB::statement('ALTER TABLE staff MODIFY social_media JSON NULL');

            DB::statement("
                UPDATE staff
                SET social_media = CASE
                    WHEN social_media IS NULL OR social_media = '' THEN '{}'
                    WHEN social_media NOT LIKE '[%' AND social_media NOT LIKE '{%' THEN '{}'
                    ELSE social_media
                END
            ");
        }

        // Convert achievements (longtext -> JSON)
        if (Schema::hasColumn('staff', 'achievements')) {
            DB::statement('ALTER TABLE staff MODIFY achievements JSON NULL');

            DB::statement("
                UPDATE staff
                SET achievements = CASE
                    WHEN achievements IS NULL OR achievements = '' THEN '[]'
                    WHEN achievements NOT LIKE '[%' AND achievements NOT LIKE '{%' THEN JSON_ARRAY(achievements)
                    ELSE achievements
                END
            ");
        }

        // Convert experience (text -> integer)
        if (Schema::hasColumn('staff', 'experience')) {
            // First, convert any text values to numbers
            DB::statement("
                UPDATE staff
                SET experience = CASE
                    WHEN experience IS NULL OR experience = '' THEN 0
                    WHEN experience REGEXP '^[0-9]+$' THEN CAST(experience AS UNSIGNED)
                    ELSE 0
                END
            ");

            DB::statement('ALTER TABLE staff MODIFY experience INT DEFAULT 0');
        }

        // Step 3: Set intelligent defaults for type based on position
        DB::statement("
            UPDATE staff
            SET type = CASE
                WHEN position LIKE '%Kepala Sekolah%' OR position LIKE '%Headmaster%' THEN 'headmaster'
                WHEN position LIKE '%Wakil%' OR position LIKE '%Vice%' THEN 'vice_headmaster'
                WHEN position LIKE '%Bimbingan%' OR position LIKE '%Konseling%' OR position LIKE '%BK%' THEN 'counselor'
                WHEN position LIKE '%Perpustakaan%' OR position LIKE '%Library%' THEN 'librarian'
                WHEN position LIKE '%Laboran%' OR position LIKE '%Lab%' THEN 'lab_assistant'
                WHEN position LIKE '%Security%' OR position LIKE '%Satpam%' THEN 'security'
                WHEN position LIKE '%TU%' OR position LIKE '%Tata Usaha%' OR position LIKE '%Admin%' THEN 'admin'
                WHEN position = '-' OR position IS NULL THEN 'staff'
                ELSE 'teacher'
            END
            WHERE type = 'staff'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            if (Schema::hasColumn('staff', 'type')) {
                $table->dropColumn('type');
            }

            if (Schema::hasColumn('staff', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
        });

        // Note: Reverting JSON to text is not safe and would lose data structure
        // So we don't revert those changes
    }
};
