<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\MediaProcessingService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Slider extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'link',
        'button_text',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * Scope for active sliders only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered sliders.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /**
     * Get the full URL to the slider image.
     * Supports both old (image field) and new (media library) approach
     */
    public function getImageUrlAttribute(): string
    {
        // Try Media Library first (new uploads)
        $media = $this->getFirstMedia('slider_image');
        
        if ($media) {
            // Return large WebP version for best quality
            return $media->hasGeneratedConversion('large') 
                ? $media->getUrl('large')
                : $media->getUrl();
        }

        // Fallback to old image field (backward compatibility)
        if ($this->image) {
            return asset("storage/{$this->image}");
        }

        return '';
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
        $this->addMediaCollection('slider_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');
    }

    /**
     * Get optimized slider image URLs (WebP + fallback)
     */
    public function getOptimizedImage(string $size = 'large'): array
    {
        // Try Media Library first (new uploads)
        $media = $this->getFirstMedia('slider_image');
        
        if ($media) {
            return MediaProcessingService::getImageUrls($media, $size);
        }

        // Fallback to old image field (backward compatibility)
        if ($this->image) {
            $url = asset("storage/{$this->image}");
            return [
                'webp' => $url,
                'jpg' => $url,
                'original' => $url,
                'thumb' => $url,
            ];
        }

        return [
            'webp' => null,
            'jpg' => null,
            'original' => null,
            'thumb' => null,
        ];
    }
}
