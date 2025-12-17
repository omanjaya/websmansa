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

        $driver = DB::connection()->getDriverName();

        // Add full-text search index based on database driver
        if ($driver === 'mysql' || $driver === 'mariadb') {
            // MySQL/MariaDB FULLTEXT index
            DB::statement('ALTER TABLE posts ADD FULLTEXT search_index (title, excerpt, content)');
        } elseif ($driver === 'pgsql') {
            // PostgreSQL: Add tsvector column and GIN index for full-text search
            DB::statement("ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vector tsvector");
            DB::statement("CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN(search_vector)");

            // Create trigger to auto-update search_vector
            DB::statement("
                CREATE OR REPLACE FUNCTION posts_search_vector_update() RETURNS trigger AS $$
                BEGIN
                    NEW.search_vector :=
                        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
                        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
                        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql
            ");

            DB::statement("
                DROP TRIGGER IF EXISTS posts_search_vector_trigger ON posts
            ");

            DB::statement("
                CREATE TRIGGER posts_search_vector_trigger
                BEFORE INSERT OR UPDATE ON posts
                FOR EACH ROW EXECUTE FUNCTION posts_search_vector_update()
            ");

            // Update existing rows
            DB::statement("
                UPDATE posts SET search_vector =
                    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(excerpt, '')), 'B') ||
                    setweight(to_tsvector('english', COALESCE(content, '')), 'C')
            ");
        }
        // SQLite doesn't support full-text search in the same way, skip
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        // Drop full-text index based on driver
        if ($driver === 'mysql' || $driver === 'mariadb') {
            DB::statement('ALTER TABLE posts DROP INDEX search_index');
        } elseif ($driver === 'pgsql') {
            DB::statement('DROP TRIGGER IF EXISTS posts_search_vector_trigger ON posts');
            DB::statement('DROP FUNCTION IF EXISTS posts_search_vector_update()');
            DB::statement('DROP INDEX IF EXISTS posts_search_idx');
            DB::statement('ALTER TABLE posts DROP COLUMN IF EXISTS search_vector');
        }

        Schema::table('posts', function (Blueprint $table) {
            $table->dropIndex('posts_status_published_featured_idx');
            $table->dropIndex('posts_type_status_published_idx');
            $table->dropIndex('posts_featured_published_idx');
            $table->dropIndex('posts_pinned_published_idx');
        });
    }
};
