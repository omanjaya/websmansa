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
            $table->string('label')->nullable()->after('key');
            $table->text('description')->nullable()->after('label');
            $table->boolean('is_public')->default(true)->after('group');
            $table->json('options')->nullable()->after('is_public'); // For dropdown/select types
            $table->integer('order')->default(0)->after('options');
            
            // Add indexes for better performance
            $table->index(['group', 'order']);
            $table->index('is_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropIndex(['group', 'order']);
            $table->dropIndex('is_public');
            $table->dropColumn(['label', 'description', 'is_public', 'options', 'order']);
        });
    }
};
