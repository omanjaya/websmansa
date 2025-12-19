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
        Schema::table('media', function (Blueprint $table) {
            // Add polymorphic relationship columns
            $table->nullableMorphs('model');
            
            // Add collection name for Spatie media library compatibility
            $table->string('collection_name')->nullable()->after('alt_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media', function (Blueprint $table) {
            $table->dropMorphs('model');
            $table->dropColumn('collection_name');
        });
    }
};
