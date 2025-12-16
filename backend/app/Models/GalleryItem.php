<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'gallery_id',
        'media_id',
        'caption',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
        'created_at' => 'datetime',
    ];

    protected $with = ['media'];

    /**
     * Get the gallery that owns this item.
     */
    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }

    /**
     * Get the media file.
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-set order if not provided
        static::creating(function ($item) {
            if ($item->order === null || $item->order === 0) {
                $maxOrder = static::where('gallery_id', $item->gallery_id)->max('order');
                $item->order = ($maxOrder ?? 0) + 1;
            }
        });
    }
}
