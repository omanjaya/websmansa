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
        // Add type column if missing
        if (!Schema::hasColumn('staff', 'type')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->string('type')->default('teacher')->after('position');
            });
        }

        // Add is_featured column if missing
        if (!Schema::hasColumn('staff', 'is_featured')) {
            Schema::table('staff', function (Blueprint $table) {
                $table->boolean('is_featured')->default(false)->after('is_active');
            });
        }

        // Update type based on position
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
                ELSE 'teacher'
            END
            WHERE type = 'teacher' OR type = '' OR type IS NULL
        ");

        // Add index if not exists
        $indexExists = DB::select("SHOW INDEX FROM staff WHERE Key_name = 'staff_type_index'");
        if (empty($indexExists)) {
            Schema::table('staff', function (Blueprint $table) {
                $table->index('type');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
