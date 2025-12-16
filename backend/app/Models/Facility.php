<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Facility extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'category',
        'location',
        'capacity',
        'area',
        'facilities',
        'images',
        'rules',
        'booking_url',
        'is_active',
        'is_featured',
        'order',
        'user_id',
    ];

    protected $casts = [
        'images' => 'array',
        'facilities' => 'array',
        'rules' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'capacity' => 'integer',
        'area' => 'integer',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderBy('name');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCategoryLabel(): string
    {
        return match ($this->category) {
            'classroom' => 'Ruang Kelas',
            'laboratory' => 'Laboratorium',
            'library' => 'Perpustakaan',
            'sports' => 'Fasilitas Olahraga',
            'canteen' => 'Kantin',
            'health' => 'UKS',
            'auditorium' => 'Aula',
            'multipurpose' => 'Ruang Serbaguna',
            'parking' => 'Area Parkir',
            'worship' => 'Tempat Ibadah',
            'toilet' => 'Toilet',
            'garden' => 'Taman',
            'computer' => 'Laboratorium Komputer',
            'science' => 'Laboratorium IPA',
            'language' => 'Laboratorium Bahasa',
            'art' => 'Studio Seni',
            'music' => 'Ruang Musik',
            default => 'Lainnya',
        };
    }

    public function getAreaFormatted(): string
    {
        if ($this->area) {
            return number_format($this->area).' m²';
        }

        return '-';
    }

    public function getCapacityFormatted(): string
    {
        if ($this->capacity) {
            return $this->capacity.' orang';
        }

        return 'Tidak terbatas';
    }

    public function getMainImage(): ?string
    {
        if (empty($this->images)) {
            return null;
        }

        return $this->images[0] ?? null;
    }

    public function getFacilitiesList(): array
    {
        return $this->facilities ?? [];
    }

    public function getRulesList(): array
    {
        return $this->rules ?? [];
    }

    public function hasBooking(): bool
    {
        return ! empty($this->booking_url);
    }

    public function canBeBooked(): bool
    {
        return $this->is_active && $this->hasBooking();
    }
}
