<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'visitors',
        'page_views',
        'hourly_data',
        'page_breakdown',
    ];

    protected $casts = [
        'date' => 'date',
        'hourly_data' => 'array',
        'page_breakdown' => 'array',
    ];

    /**
     * Get or create today's stats
     */
    public static function today()
    {
        return static::firstOrCreate(
            ['date' => now()->toDateString()],
            ['visitors' => 0, 'page_views' => 0]
        );
    }

    /**
     * Increment visitor count
     */
    public function incrementVisitors(int $count = 1)
    {
        $this->increment('visitors', $count);
    }

    /**
     * Increment page view count
     */
    public function incrementPageViews(int $count = 1)
    {
        $this->increment('page_views', $count);
    }
}
