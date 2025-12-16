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
        Schema::create('tracer_studies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alumni_id')->nullable()->constrained('alumni')->onDelete('set null');
            $table->string('name');
            $table->year('graduation_year');
            $table->string('email');
            $table->string('phone', 20)->nullable();

            // Current Status
            $table->enum('current_status', ['working', 'studying', 'entrepreneur', 'unemployed', 'other']);
            $table->string('occupation')->nullable();
            $table->string('institution_name')->nullable();
            $table->string('institution_type', 100)->nullable();
            $table->string('field_of_work')->nullable();

            // Education Continuation
            $table->boolean('is_continuing_education')->default(false);
            $table->string('university_name')->nullable();
            $table->string('major')->nullable();
            $table->enum('education_level', ['D3', 'S1', 'S2', 'S3'])->nullable();

            // Satisfaction Survey (1-5 scale)
            $table->unsignedTinyInteger('satisfaction_curriculum')->nullable();
            $table->unsignedTinyInteger('satisfaction_facilities')->nullable();
            $table->unsignedTinyInteger('satisfaction_teachers')->nullable();
            $table->text('suggestions')->nullable();

            $table->timestamp('submitted_at')->useCurrent();

            // Indexes
            $table->index('graduation_year');
            $table->index('current_status');
            $table->index('submitted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracer_studies');
    }
};
