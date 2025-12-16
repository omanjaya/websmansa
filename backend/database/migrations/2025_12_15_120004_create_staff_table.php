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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('nip')->unique()->nullable(); // Nomor Induk Pegawai
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('photo')->nullable();
            $table->string('position');
            $table->enum('department', [
                'mathematics', 'indonesian', 'english', 'physics', 'chemistry',
                'biology', 'history', 'geography', 'economics', 'sociology',
                'civics', 'religion', 'art', 'music', 'pe', 'it',
                'counseling', 'library', 'laboratory', 'administration',
                'finance', 'student_affairs', 'curriculum', 'facilities',
                'public_relation', 'security', 'cleaning', 'cafeteria', 'health',
            ]);
            $table->enum('type', [
                'teacher', 'admin', 'staff', 'headmaster', 'vice_headmaster',
                'counselor', 'librarian', 'lab_assistant', 'security',
                'cleaner', 'cafeteria',
            ]);
            $table->json('subjects')->nullable(); // array of subjects taught
            $table->json('qualifications')->nullable(); // array of degrees/certifications
            $table->integer('experience')->default(0); // years of experience
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->json('social_media')->nullable(); // social media links
            $table->text('bio')->nullable();
            $table->json('achievements')->nullable(); // array of achievements
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['is_active', 'is_featured']);
            $table->index('department');
            $table->index('type');
            $table->index('order');
            $table->index('nip');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
