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
        Schema::create('extras', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->text('short_description')->nullable();
            $table->enum('category', [
                'sports', 'arts', 'academic', 'social', 'technology',
                'language', 'leadership', 'volunteer', 'religious',
            ]);
            $table->string('schedule')->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->json('requirements')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('logo')->nullable();
            $table->json('images')->nullable();
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

        // Pivot table for extra members
        Schema::create('extra_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('extra_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role')->default('member');
            $table->timestamp('joined_at');
            $table->timestamps();

            // Unique constraint to prevent duplicate memberships
            $table->unique(['extra_id', 'user_id']);
            $table->index(['extra_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extra_members');
        Schema::dropIfExists('extras');
    }
};
