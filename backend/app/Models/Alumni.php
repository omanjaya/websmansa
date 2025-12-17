<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Alumni extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $table = 'alumni';

    protected $fillable = [
        'name',
        'graduation_year',
        'class',
        'photo',
        'email',
        'phone',
        'current_occupation',
        'current_institution',
        'achievements',
        'bio',
        'is_public',
        'is_verified',
        'is_featured',
        'category',
        'quote',
        'order',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
        'is_public' => 'boolean',
        'is_verified' => 'boolean',
        'is_featured' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'photo_url',
        'color',
        'glow_color',
    ];

    /**
     * Category color mapping for carousel display
     */
    protected static array $categoryColors = [
        'Kedokteran' => ['color' => 'from-red-400 to-rose-500', 'glow' => 'rgba(251, 113, 133, 0.4)'],
        'Entrepreneur' => ['color' => 'from-purple-400 to-violet-500', 'glow' => 'rgba(167, 139, 250, 0.4)'],
        'Diplomat' => ['color' => 'from-blue-400 to-cyan-500', 'glow' => 'rgba(96, 165, 250, 0.4)'],
        'Teknologi' => ['color' => 'from-green-400 to-emerald-500', 'glow' => 'rgba(74, 222, 128, 0.4)'],
        'Akademisi' => ['color' => 'from-yellow-400 to-orange-500', 'glow' => 'rgba(251, 191, 36, 0.4)'],
        'Seni' => ['color' => 'from-pink-400 to-rose-500', 'glow' => 'rgba(251, 113, 133, 0.4)'],
        'Hukum' => ['color' => 'from-slate-400 to-slate-600', 'glow' => 'rgba(148, 163, 184, 0.4)'],
        'Militer' => ['color' => 'from-emerald-400 to-teal-500', 'glow' => 'rgba(52, 211, 153, 0.4)'],
    ];

    /**
     * Scope for public alumni
     */
    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for verified alumni
     */
    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope for featured alumni
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for alumni by graduation year
     */
    public function scopeByYear(Builder $query, int $year): Builder
    {
        return $query->where('graduation_year', $year);
    }

    /**
     * Scope for alumni by category
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Scope ordered by graduation year descending
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderByDesc('graduation_year')->orderByDesc('created_at');
    }

    /**
     * Scope ordered by custom order
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderByDesc('graduation_year');
    }

    /**
     * Get the full URL to the photo
     */
    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->photo) {
            return null;
        }

        // Check if it's already a full URL
        if (Str::startsWith($this->photo, ['http://', 'https://'])) {
            return $this->photo;
        }

        return asset("storage/{$this->photo}");
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
}
