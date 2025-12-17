<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasColumn('extras', 'deleted_at')) {
            Schema::table('extras', function (Blueprint $table) {
                $table->softDeletes();
            });
        }

        if (!Schema::hasColumn('announcements', 'deleted_at')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('extras', 'deleted_at')) {
            Schema::table('extras', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }

        if (Schema::hasColumn('announcements', 'deleted_at')) {
            Schema::table('announcements', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
