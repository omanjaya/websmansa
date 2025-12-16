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
        Schema::create('alumni', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('name');
            $table->year('graduation_year');
            $table->string('class', 50)->nullable()->comment('Kelas terakhir');
            $table->string('photo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('current_occupation')->nullable();
            $table->string('current_institution')->nullable()->comment('Universitas/Perusahaan');
            $table->text('achievements')->nullable();
            $table->text('bio')->nullable();
            $table->boolean('is_public')->default(true)->comment('Show in public directory');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('graduation_year');
            $table->index('is_public');
            $table->index('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni');
    }
};
