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
        // Classes table
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // X-1, XI-IPA-1, XII-IPS-2
            $table->string('grade'); // 10, 11, 12
            $table->string('major')->nullable(); // IPA, IPS, etc.
            $table->foreignId('homeroom_teacher_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->string('academic_year'); // 2024/2025
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Subjects table
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // MTK, BIO, FIS
            $table->string('name'); // Matematika, Biologi
            $table->string('category')->nullable(); // Wajib, Peminatan
            $table->integer('credit_hours')->default(2); // SKS/Jam pelajaran
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // Schedules table
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->enum('day', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room')->nullable();
            $table->string('academic_year'); // 2024/2025
            $table->enum('semester', ['odd', 'even']); // Ganjil/Genap
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['class_id', 'day']);
            $table->index(['teacher_id', 'day']);
            $table->index('academic_year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('classes');
    }
};
