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
        Schema::create('visitor_stats', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique(); // Daily aggregation
            $table->integer('visitors')->default(0); // Unique visitors
            $table->integer('page_views')->default(0); // Total page views
            $table->json('hourly_data')->nullable(); // Hourly breakdown
            $table->json('page_breakdown')->nullable(); // Page-specific stats
            $table->timestamps();
            
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_stats');
    }
};
