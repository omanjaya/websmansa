<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $grade
 * @property string|null $major
 * @property int|null $homeroom_teacher_id
 * @property string $academic_year
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class SchoolClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'grade',
        'major',
        'homeroom_teacher_id',
        'academic_year',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the homeroom teacher.
     */
    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'homeroom_teacher_id');
    }

    /**
     * Get all schedules for this class.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'class_id');
    }

    /**
     * Get full class name.
     */
    public function getFullNameAttribute(): string
    {
        $name = "Kelas {$this->grade}";
        if ($this->major) {
            $name .= " - {$this->major}";
        }
        $name .= " ({$this->name})";
        return $name;
    }

    /**
     * Get grade label.
     */
    public function getGradeLabelAttribute(): string
    {
        return match ($this->grade) {
            '10' => 'Kelas X',
            '11' => 'Kelas XI',
            '12' => 'Kelas XII',
            default => "Kelas {$this->grade}",
        };
    }
}
