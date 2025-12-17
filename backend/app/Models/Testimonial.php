<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['name', 'description', 'image', 'year', 'status', 'rating', 'created_by'];

    protected $casts = [
        'status' => 'boolean',
        'rating' => 'integer',
        'year' => 'integer',
    ];

    protected $appends = ['photo_url', 'content', 'is_featured', 'role'];

    /**
     * Scope for featured (active) testimonials
     */
    public function scopeFeatured($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope for ordered testimonials (by year descending, then created_at)
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('year', 'desc')->orderBy('created_at', 'desc');
    }

    /**
     * Get photo URL attribute
     */
    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->image) {
            return null;
        }

        // Check if it's already an external URL
        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }

        return asset("storage/{$this->image}");
    }

    /**
     * Map description to content for API compatibility
     */
    public function getContentAttribute(): ?string
    {
        return $this->description;
    }

    /**
     * Map status to is_featured for API compatibility
     */
    public function getIsFeaturedAttribute(): bool
    {
        return (bool) $this->status;
    }

    /**
     * Get role attribute (derived from year)
     */
    public function getRoleAttribute(): string
    {
        return "Alumni {$this->year}";
    }
}
