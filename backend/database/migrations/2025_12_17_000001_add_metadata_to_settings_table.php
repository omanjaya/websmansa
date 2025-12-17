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
        Schema::table('settings', function (Blueprint $table) {
            if (!Schema::hasColumn('settings', 'label')) {
                $table->string('label')->nullable()->after('key');
            }
            if (!Schema::hasColumn('settings', 'description')) {
                $table->text('description')->nullable()->after('label');
            }
            if (!Schema::hasColumn('settings', 'is_public')) {
                $table->boolean('is_public')->default(true)->after('group');
            }
            if (!Schema::hasColumn('settings', 'options')) {
                $table->json('options')->nullable()->after('is_public');
            }
            if (!Schema::hasColumn('settings', 'order')) {
                $table->integer('order')->default(0)->after('options');
            }
        });

        // Add indexes separately with try-catch for safety
        try {
            Schema::table('settings', function (Blueprint $table) {
                $table->index(['group', 'order'], 'settings_group_order_idx');
            });
        } catch (\Exception $e) {
            // Index may already exist
        }

        try {
            Schema::table('settings', function (Blueprint $table) {
                $table->index('is_public', 'settings_is_public_idx');
            });
        } catch (\Exception $e) {
            // Index may already exist
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Drop indexes if they exist
            try {
                $table->dropIndex('settings_group_order_idx');
            } catch (\Exception $e) {}

            try {
                $table->dropIndex('settings_is_public_idx');
            } catch (\Exception $e) {}

            // Drop columns if they exist
            $columnsToDrop = [];
            foreach (['label', 'description', 'is_public', 'options', 'order'] as $column) {
                if (Schema::hasColumn('settings', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
