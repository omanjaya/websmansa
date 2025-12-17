<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\MediaProcessingService;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
// use Illuminate\Database\Eloquent\SoftDeletes; // Not available in current schema
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Gallery extends Model implements HasMedia
{
    use HasFactory, HasUuid, InteractsWithMedia;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'created_by',
    ];

    protected $casts = [];

    protected $appends = [
        'thumbnail_url',
        'items_count',
        'title', // Alias for name
    ];

    /**
     * Get all gallery items.
     */
    public function items(): HasMany
    {
        return $this->hasMany(GalleryItem::class)->orderBy('order');
    }

    /**
     * Scope for featured galleries (returns all for now since is_featured column doesn't exist).
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query; // No is_featured column in current schema
    }

    /**
     * Scope for galleries by type (not supported in current schema).
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query; // No type column in current schema
    }

    /**
     * Scope for latest galleries.
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get title attribute (alias for name).
     */
    public function getTitleAttribute(): ?string
    {
        return $this->name;
    }

    /**
     * Get the full URL to the thumbnail.
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail) {
            // Get first item's image as fallback
            $firstItem = $this->items()->with('media')->first();
            return $firstItem?->media?->url;
        }

        return asset("storage/{$this->thumbnail}");
    }

    /**
     * Get the count of items in this gallery.
     */
    public function getItemsCountAttribute(): int
    {
        return $this->items()->count();
    }

    /**
     * Register media conversions for image optimization
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        $this->addMediaConversion('thumb-jpg')
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format('jpg')
            ->quality(85)
            ->nonQueued();

        $this->addMediaConversion('small')
            ->width(400)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(800)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        $this->addMediaConversion('medium-jpg')
            ->width(800)
            ->format('jpg')
            ->quality(85)
            ->nonQueued();

        $this->addMediaConversion('large')
            ->width(1200)
            ->format('webp')
            ->quality(90)
            ->nonQueued();

        $this->addMediaConversion('large-jpg')
            ->width(1200)
            ->format('jpg')
            ->quality(90)
            ->nonQueued();
    }

    /**
     * Register media collections
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');
    }

    /**
     * Get optimized thumbnail URLs (WebP + fallback)
     * Supports both old (thumbnail field) and new (media library) approach
     */
    public function getOptimizedThumbnail(string $size = 'medium'): array
    {
        // Try to get from Media Library first (new uploads)
        $media = $this->getFirstMedia('thumbnail');
        
        if ($media) {
            return MediaProcessingService::getImageUrls($media, $size);
        }

        // Fallback to old thumbnail field (backward compatibility)
        if ($this->thumbnail) {
            $url = asset("storage/{$this->thumbnail}");
            return [
                'webp' => $url,
                'jpg' => $url,
                'original' => $url,
                'thumb' => $url,
            ];
        }

        // Last fallback: first gallery item
        $firstItem = $this->items()->with('media')->first();
        if ($firstItem?->media?->url) {
            return [
                'webp' => $firstItem->media->url,
                'jpg' => $firstItem->media->url,
                'original' => $firstItem->media->url,
                'thumb' => $firstItem->media->url,
            ];
        }

        return [
            'webp' => null,
            'jpg' => null,
            'original' => null,
            'thumb' => null,
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from name if not provided
        static::creating(function ($gallery) {
            if (!$gallery->slug) {
                $gallery->slug = \Illuminate\Support\Str::slug($gallery->name);
            }
        });
    }
}
