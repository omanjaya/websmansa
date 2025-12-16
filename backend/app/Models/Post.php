<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Services\MediaProcessingService;
use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Post extends Model implements HasMedia
{
    use HasFactory, HasUuid, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'status',
        'type',
        'is_featured',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
        'status' => PostStatus::class,
        'type' => PostType::class,
    ];

    protected $appends = [
        'featured_image_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'post_category');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', PostStatus::PUBLISHED->value)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeOfType(Builder $query, PostType $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopePinned(Builder $query): Builder
    {
        return $query->where('is_pinned', true);
    }

    public function isPublished(): bool
    {
        return $this->status === PostStatus::PUBLISHED
            && $this->published_at
            && $this->published_at <= now();
    }

    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ?: strip_tags(substr($this->content ?? '', 0, 200)).'...'
        );
    }

    public function getFeaturedImageUrlAttribute(): string
    {
        $media = $this->getFirstMedia('featured_image');
        
        if ($media) {
            return $media->hasGeneratedConversion('large') 
                ? $media->getUrl('large')
                : $media->getUrl();
        }

        if ($this->featured_image) {
            return asset("storage/{$this->featured_image}");
        }

        return '';
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(150)->height(150)->sharpen(10)->format('webp')->quality(85)->nonQueued();
        $this->addMediaConversion('thumb-jpg')
            ->width(150)->height(150)->sharpen(10)->format('jpg')->quality(85)->nonQueued();
        $this->addMediaConversion('small')
            ->width(400)->format('webp')->quality(85)->nonQueued();
        $this->addMediaConversion('medium')
            ->width(800)->format('webp')->quality(85)->nonQueued();
        $this->addMediaConversion('medium-jpg')
            ->width(800)->format('jpg')->quality(85)->nonQueued();
        $this->addMediaConversion('large')
            ->width(1200)->format('webp')->quality(90)->nonQueued();
        $this->addMediaConversion('large-jpg')
            ->width(1200)->format('jpg')->quality(90)->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');
    }

    public function getOptimizedFeaturedImage(string $size = 'large'): array
    {
        $media = $this->getFirstMedia('featured_image');
        
        if ($media) {
            return MediaProcessingService::getImageUrls($media, $size);
        }

        if ($this->featured_image) {
            $url = asset("storage/{$this->featured_image}");
            return ['webp' => $url, 'jpg' => $url, 'original' => $url, 'thumb' => $url];
        }

        return ['webp' => null, 'jpg' => null, 'original' => null, 'thumb' => null];
    }
}
