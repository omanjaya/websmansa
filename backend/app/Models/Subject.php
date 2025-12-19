<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $category
 * @property int $credit_hours
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'category',
        'credit_hours',
        'is_active',
    ];

    protected $casts = [
        'credit_hours' => 'integer',
        'is_active' => 'boolean',
    ];

    public const CATEGORIES = [
        'wajib' => 'Mata Pelajaran Wajib',
        'peminatan' => 'Mata Pelajaran Peminatan',
        'muatan_lokal' => 'Muatan Lokal',
        'pengembangan_diri' => 'Pengembangan Diri',
    ];

    /**
     * Get all schedules for this subject.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get category label.
     */
    public function getCategoryLabelAttribute(): string
    {
        return self::CATEGORIES[$this->category] ?? $this->category ?? '-';
    }

    /**
     * Get formatted name with code.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->code} - {$this->name}";
    }
}
