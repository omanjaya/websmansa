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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('file_name');
            $table->string('mime_type', 100);
            $table->string('path', 500);
            $table->string('disk', 50)->default('public');
            $table->unsignedBigInteger('size')->comment('Size in bytes');
            $table->unsignedInteger('width')->nullable()->comment('For images');
            $table->unsignedInteger('height')->nullable()->comment('For images');
            $table->string('alt_text')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('mime_type');
            $table->index('uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
