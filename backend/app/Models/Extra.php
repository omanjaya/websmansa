<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

final class Extra extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'category',
        'schedule',
        'contact_person',
        'contact_phone',
        'contact_email',
        'requirements',
        'capacity',
        'logo',
        'images',
        'is_active',
        'is_featured',
        'order',
        'user_id',
    ];

    protected $casts = [
        'images' => 'array',
        'requirements' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'capacity' => 'integer',
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

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'extra_members')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function getCategoryLabel(): string
    {
        return match ($this->category) {
            'sports' => 'Olahraga',
            'arts' => 'Kesenian',
            'academic' => 'Akademik',
            'social' => 'Sosial',
            'technology' => 'Teknologi',
            'language' => 'Bahasa',
            'leadership' => 'Kepemimpinan',
            'volunteer' => 'Kerelawanan',
            'religious' => 'Keagamaan',
            default => 'Lainnya',
        };
    }

    public function getScheduleFormatted(): string
    {
        return $this->schedule ?? 'Disesuaikan';
    }

    public function getCapacityLabel(): string
    {
        if ($this->capacity) {
            return $this->capacity.' orang';
        }

        return 'Tidak terbatas';
    }

    public function isUserMember(?User $user = null): bool
    {
        if (! $user) {
            return false;
        }

        return $this->members()->where('user_id', $user->id)->exists();
    }

    public function hasAvailableSlots(): bool
    {
        if (! $this->capacity) {
            return true;
        }

        return $this->members()->count() < $this->capacity;
    }

    public function getAvailableSlots(): int
    {
        if (! $this->capacity) {
            return 999;
        }

        return max(0, $this->capacity - $this->members()->count());
    }
}
