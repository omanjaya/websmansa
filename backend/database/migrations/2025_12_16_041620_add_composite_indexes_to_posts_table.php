<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Composite indexes for common query patterns
            $table->index(['status', 'published_at', 'is_featured'], 'posts_status_published_featured_idx');
            $table->index(['type', 'status', 'published_at'], 'posts_type_status_published_idx');
            $table->index(['is_featured', 'published_at'], 'posts_featured_published_idx');
            $table->index(['is_pinned', 'published_at'], 'posts_pinned_published_idx');
        });

        // Add full-text search index (MySQL/MariaDB only)
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE posts ADD FULLTEXT search_index (title, excerpt, content)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop full-text index first
        if (DB::connection()->getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE posts DROP INDEX search_index');
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('posts_status_published_featured_idx');
            $table->dropIndex('posts_type_status_published_idx');
            $table->dropIndex('posts_featured_published_idx');
            $table->dropIndex('posts_pinned_published_idx');
        });
    }
};
