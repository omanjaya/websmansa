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
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category')->comment('Akademik, Olahraga, Seni, Teknologi, Internasional');
            $table->year('year');
            $table->string('level')->default('national')->comment('school, regional, national, international');
            $table->string('organizer')->nullable()->comment('Penyelenggara');
            $table->string('image')->nullable();
            $table->json('participants')->nullable()->comment('Nama peserta/tim');
            $table->string('coach')->nullable()->comment('Pembimbing');
            $table->string('medal_type')->nullable()->comment('gold, silver, bronze, winner, finalist');
            $table->integer('rank')->nullable()->comment('Peringkat jika tidak ada medali');
            $table->date('achievement_date')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('category');
            $table->index('year');
            $table->index('level');
            $table->index('is_featured');
            $table->index('is_active');
            $table->index(['is_active', 'is_featured']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
