<?php

declare(strict_types=1);

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
        Schema::create('facilities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->enum('category', [
                'classroom', 'laboratory', 'library', 'sports', 'canteen',
                'health', 'auditorium', 'multipurpose', 'parking', 'worship',
                'toilet', 'garden', 'computer', 'science', 'language',
                'art', 'music',
            ]);
            $table->string('location')->nullable();
            $table->integer('capacity')->nullable();
            $table->integer('area')->nullable(); // in square meters
            $table->json('facilities')->nullable(); // array of facility features
            $table->json('images')->nullable(); // array of image URLs
            $table->json('rules')->nullable(); // array of rules/usage guidelines
            $table->string('booking_url')->nullable(); // external booking URL
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['is_active', 'is_featured']);
            $table->index('category');
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
