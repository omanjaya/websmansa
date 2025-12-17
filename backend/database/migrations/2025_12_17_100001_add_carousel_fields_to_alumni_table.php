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
        Schema::table('alumni', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('is_verified');
            $table->string('category')->nullable()->after('is_featured')->comment('Kedokteran, Entrepreneur, Diplomat, etc.');
            $table->text('quote')->nullable()->after('bio')->comment('Testimonial/kutipan dari alumni');
            $table->integer('order')->default(0)->after('quote');

            // Indexes
            $table->index('is_featured');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('alumni', function (Blueprint $table) {
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['category']);
            $table->dropColumn(['is_featured', 'category', 'quote', 'order']);
        });
    }
};
