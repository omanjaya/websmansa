<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['name', 'role', 'photo', 'content', 'rating', 'is_featured', 'order'];
    protected $casts = ['is_featured' => 'boolean', 'rating' => 'integer', 'order' => 'integer'];
    protected $appends = ['photo_url'];

    public function scopeFeatured($query) { return $query->where('is_featured', true); }
    public function scopeOrdered($query) { return $query->orderBy('order'); }
    public function getPhotoUrlAttribute(): ?string { return $this->photo ? asset("storage/{$this->photo}") : null; }
}
