<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            // Add uuid column if not exists
            if (!Schema::hasColumn('galleries', 'uuid')) {
                $table->uuid('uuid')->after('id')->unique()->nullable();
            }
            
            // Add title column if name doesn't exist (in case model expects both)
            if (!Schema::hasColumn('galleries', 'title') && Schema::hasColumn('galleries', 'name')) {
                // name already exists, model uses getTitleAttribute accessor
            }
            
            // Add type column for gallery categorization
            if (!Schema::hasColumn('galleries', 'type')) {
                $table->string('type')->default('photo')->after('description');
            }
            
            // Add is_featured column
            if (!Schema::hasColumn('galleries', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('type');
            }
            
            // Add is_active column
            if (!Schema::hasColumn('galleries', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('is_featured');
            }
            
            // Add thumbnail column for backward compatibility
            if (!Schema::hasColumn('galleries', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('description');
            }
            
            // Add order column
            if (!Schema::hasColumn('galleries', 'order')) {
                $table->integer('order')->default(0)->after('is_active');
            }
        });
        
        // Populate uuid for existing records
        $galleries = \DB::table('galleries')->whereNull('uuid')->get();
        foreach ($galleries as $gallery) {
            \DB::table('galleries')
                ->where('id', $gallery->id)
                ->update(['uuid' => (string) Str::uuid()]);
        }
        
        // Make uuid non-nullable after populating
        Schema::table('galleries', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('galleries', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'type', 'is_featured', 'is_active', 'thumbnail', 'order']);
        });
    }
};
