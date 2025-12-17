<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Achievement extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'year',
        'level',
        'organizer',
        'image',
        'participants',
        'coach',
        'medal_type',
        'rank',
        'achievement_date',
        'is_featured',
        'is_active',
        'order',
    ];

    protected $casts = [
        'participants' => 'array',
        'year' => 'integer',
        'rank' => 'integer',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
        'achievement_date' => 'date',
    ];

    protected $appends = [
        'image_url',
        'color',
        'glow_color',
    ];

    /**
     * Category color mapping
     */
    protected static array $categoryColors = [
        'Akademik' => ['color' => 'from-yellow-400 to-orange-500', 'glow' => 'rgba(251, 191, 36, 0.4)'],
        'Olahraga' => ['color' => 'from-green-400 to-cyan-500', 'glow' => 'rgba(74, 222, 128, 0.4)'],
        'Seni' => ['color' => 'from-pink-400 to-rose-500', 'glow' => 'rgba(251, 113, 133, 0.4)'],
        'Teknologi' => ['color' => 'from-red-400 to-rose-500', 'glow' => 'rgba(239, 68, 68, 0.4)'],
        'Internasional' => ['color' => 'from-blue-400 to-purple-500', 'glow' => 'rgba(96, 165, 250, 0.4)'],
    ];

    /**
     * Scope for active achievements
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for featured achievements
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for achievements by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for achievements by year
     */
    public function scopeByYear(Builder $query, int $year): Builder
    {
        return $query->where('year', $year);
    }

    /**
     * Scope for achievements by level
     */
    public function scopeByLevel(Builder $query, string $level): Builder
    {
        return $query->where('level', $level);
    }

    /**
     * Scope ordered by most recent
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderByDesc('achievement_date')->orderByDesc('year')->orderByDesc('created_at');
    }

    /**
     * Scope ordered by custom order
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderByDesc('achievement_date');
    }

    /**
     * Get the full URL to the image
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // Check if it's already a full URL
        if (Str::startsWith($this->image, ['http://', 'https://'])) {
            return $this->image;
        }

        return asset("storage/{$this->image}");
    }

    /**
     * Get color gradient based on category
     */
    public function getColorAttribute(): string
    {
        return self::$categoryColors[$this->category]['color'] ?? 'from-gray-400 to-gray-500';
    }

    /**
     * Get glow color based on category
     */
    public function getGlowColorAttribute(): string
    {
        return self::$categoryColors[$this->category]['glow'] ?? 'rgba(156, 163, 175, 0.4)';
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($achievement) {
            if (!$achievement->slug) {
                $achievement->slug = Str::slug($achievement->title);
            }
        });
    }
}
