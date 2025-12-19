<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration adds missing columns required by Spatie Media Library
     */
    public function up(): void
    {
        Schema::table('media', function (Blueprint $table) {
            // Add columns required by Spatie Media Library if they don't exist
            if (!Schema::hasColumn('media', 'conversions_disk')) {
                $table->string('conversions_disk', 255)->nullable()->after('disk');
            }
            
            if (!Schema::hasColumn('media', 'custom_properties')) {
                $table->json('custom_properties')->nullable()->after('alt_text');
            }
            
            if (!Schema::hasColumn('media', 'generated_conversions')) {
                $table->json('generated_conversions')->nullable()->after('custom_properties');
            }
            
            if (!Schema::hasColumn('media', 'responsive_images')) {
                $table->json('responsive_images')->nullable()->after('generated_conversions');
            }
            
            if (!Schema::hasColumn('media', 'manipulations')) {
                $table->json('manipulations')->nullable()->after('responsive_images');
            }
            
            if (!Schema::hasColumn('media', 'order_column')) {
                $table->unsignedInteger('order_column')->nullable()->after('manipulations');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropColumn([
                'conversions_disk',
                'custom_properties',
                'generated_conversions',
                'responsive_images',
                'manipulations',
                'order_column',
            ]);
        });
    }
};
