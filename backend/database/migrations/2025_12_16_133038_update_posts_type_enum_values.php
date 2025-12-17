<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        // Update existing 'post' values to 'news'
        DB::table('posts')->where('type', 'post')->update(['type' => 'news']);

        if ($driver === 'mysql' || $driver === 'mariadb') {
            // MySQL: Modify the enum column
            DB::statement("ALTER TABLE posts MODIFY COLUMN type ENUM('news', 'announcement', 'achievement', 'page') DEFAULT 'news'");
        } elseif ($driver === 'pgsql') {
            // PostgreSQL: Drop and recreate the constraint
            // First drop the old constraint if it exists
            DB::statement("ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_type_check");
            // Add new constraint
            DB::statement("ALTER TABLE posts ADD CONSTRAINT posts_type_check CHECK (type IN ('news', 'announcement', 'achievement', 'page'))");
            // Update default
            DB::statement("ALTER TABLE posts ALTER COLUMN type SET DEFAULT 'news'");
        }
        // SQLite: No enum constraints, just the update is enough
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        // Update 'news' back to 'post'
        DB::table('posts')->where('type', 'news')->update(['type' => 'post']);

        // Update any 'achievement' to 'post' since it didn't exist
        DB::table('posts')->where('type', 'achievement')->update(['type' => 'post']);

        if ($driver === 'mysql' || $driver === 'mariadb') {
            // MySQL: Revert the enum column
            DB::statement("ALTER TABLE posts MODIFY COLUMN type ENUM('post', 'announcement', 'page') DEFAULT 'post'");
        } elseif ($driver === 'pgsql') {
            // PostgreSQL: Update constraint
            DB::statement("ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_type_check");
            DB::statement("ALTER TABLE posts ADD CONSTRAINT posts_type_check CHECK (type IN ('post', 'announcement', 'page'))");
            DB::statement("ALTER TABLE posts ALTER COLUMN type SET DEFAULT 'post'");
        }
    }
};
