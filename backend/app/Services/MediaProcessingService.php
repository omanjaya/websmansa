<?php

namespace App\Services;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Media Processing Service using Spatie Media Library
 * Handles automatic image optimization, WebP conversion, and multi-size generation
 */
class MediaProcessingService
{
    /**
     * Register media collections for a model
     */
    public static function registerStandardCollections(HasMedia $model): void
    {
        $model->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'])
            ->useDisk('public');

        $model->addMediaCollection('featured_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');

        $model->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');
    }

    /**
     * Define standard image conversions
     * Creates WebP and JPEG versions in multiple sizes
     */
    public static function registerStandardConversions(Media $media): void
    {
        // Thumbnail - 150x150 (center crop) - WebP
        $media->addMediaConversion('thumb')
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        // Thumbnail - JPEG fallback
        $media->addMediaConversion('thumb-jpg')
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format('jpg')
            ->quality(85)
            ->nonQueued();

        // Small - 400px width - WebP
        $media->addMediaConversion('small')
            ->width(400)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        // Medium - 800px width - WebP
        $media->addMediaConversion('medium')
            ->width(800)
            ->format('webp')
            ->quality(85)
            ->nonQueued();

        // Medium - JPEG fallback
        $media->addMediaConversion('medium-jpg')
            ->width(800)
            ->format('jpg')
            ->quality(85)
            ->nonQueued();

        // Large - 1200px width - WebP
        $media->addMediaConversion('large')
            ->width(1200)
            ->format('webp')
            ->quality(90)
            ->nonQueued();

        // Large - JPEG fallback
        $media->addMediaConversion('large-jpg')
            ->width(1200)
            ->format('jpg')
            ->quality(90)
            ->nonQueued();
    }

    /**
     * Get optimized image URLs with WebP and fallback
     */
    public static function getImageUrls(?Media $media, string $size = 'medium'): array
    {
        if (!$media) {
            return [
                'webp' => null,
                'jpg' => null,
                'original' => null,
                'thumb' => null,
            ];
        }

        $jpgConversion = $size === 'thumb' ? 'thumb-jpg' : ($size === 'large' ? 'large-jpg' : 'medium-jpg');

        return [
            'webp' => $media->hasGeneratedConversion($size) ? $media->getUrl($size) : $media->getUrl(),
            'jpg' => $media->hasGeneratedConversion($jpgConversion) ? $media->getUrl($jpgConversion) : $media->getUrl(),
            'original' => $media->getUrl(),
            'thumb' => $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $media->getUrl(),
        ];
    }

    /**
     * Process and upload image with automatic optimization
     */
    public static function processAndUpload(
        HasMedia $model,
        $file,
        string $collection = 'images',
        array $customProperties = []
    ): Media {
        return $model->addMedia($file)
            ->withCustomProperties(array_merge([
                'optimized' => true,
                'uploaded_at' => now()->toISOString(),
            ], $customProperties))
            ->toMediaCollection($collection);
    }

    /**
     * Get responsive srcset for picture element
     */
    public static function getResponsiveSrcset(?Media $media): array
    {
        if (!$media) {
            return [];
        }

        return [
            'small' => $media->hasGeneratedConversion('small') ? $media->getUrl('small') : $media->getUrl(),
            'medium' => $media->hasGeneratedConversion('medium') ? $media->getUrl('medium') : $media->getUrl(),
            'large' => $media->hasGeneratedConversion('large') ? $media->getUrl('large') : $media->getUrl(),
        ];
    }

    /**
     * Get picture element HTML with WebP and fallback
     */
    public static function getPictureElement(?Media $media, string $alt = '', string $classes = ''): string
    {
        if (!$media) {
            return '';
        }

        $urls = self::getImageUrls($media, 'large');
        
        return sprintf(
            '<picture>
                <source srcset="%s" type="image/webp">
                <img src="%s" alt="%s" class="%s" loading="lazy">
            </picture>',
            $urls['webp'],
            $urls['jpg'],
            htmlspecialchars($alt),
            htmlspecialchars($classes)
        );
    }
}
