<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $class_id
 * @property int $subject_id
 * @property int|null $teacher_id
 * @property string $day
 * @property string $start_time
 * @property string $end_time
 * @property string|null $room
 * @property string $academic_year
 * @property string $semester
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'class_id',
        'subject_id',
        'teacher_id',
        'day',
        'start_time',
        'end_time',
        'room',
        'academic_year',
        'semester',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public const DAYS = [
        'monday' => 'Senin',
        'tuesday' => 'Selasa',
        'wednesday' => 'Rabu',
        'thursday' => 'Kamis',
        'friday' => 'Jumat',
        'saturday' => 'Sabtu',
    ];

    public const SEMESTERS = [
        'odd' => 'Ganjil',
        'even' => 'Genap',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Schedule $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the class.
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the teacher.
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'teacher_id');
    }

    /**
     * Scope by day.
     */
    public function scopeByDay(Builder $query, string $day): Builder
    {
        return $query->where('day', $day);
    }

    /**
     * Scope by class.
     */
    public function scopeByClass(Builder $query, int $classId): Builder
    {
        return $query->where('class_id', $classId);
    }

    /**
     * Scope by teacher.
     */
    public function scopeByTeacher(Builder $query, int $teacherId): Builder
    {
        return $query->where('teacher_id', $teacherId);
    }

    /**
     * Scope by academic year.
     */
    public function scopeByAcademicYear(Builder $query, string $year): Builder
    {
        return $query->where('academic_year', $year);
    }

    /**
     * Scope by semester.
     */
    public function scopeBySemester(Builder $query, string $semester): Builder
    {
        return $query->where('semester', $semester);
    }

    /**
     * Scope active schedules.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Get day label in Indonesian.
     */
    public function getDayLabelAttribute(): string
    {
        return self::DAYS[$this->day] ?? ucfirst($this->day);
    }

    /**
     * Get semester label.
     */
    public function getSemesterLabelAttribute(): string
    {
        return self::SEMESTERS[$this->semester] ?? ucfirst($this->semester);
    }

    /**
     * Get formatted time range.
     */
    public function getTimeRangeAttribute(): string
    {
        $start = date('H:i', strtotime($this->start_time));
        $end = date('H:i', strtotime($this->end_time));
        return "{$start} - {$end}";
    }

    /**
     * Get duration in minutes.
     */
    public function getDurationAttribute(): int
    {
        $start = strtotime($this->start_time);
        $end = strtotime($this->end_time);
        return (int) (($end - $start) / 60);
    }

    /**
     * Check for schedule conflicts.
     * 
     * @return Builder<Schedule>
     */
    public static function checkConflicts(
        int $classId,
        string $day,
        string $startTime,
        string $endTime,
        string $academicYear,
        string $semester,
        ?int $excludeId = null
    ): Builder {
        $query = static::where('class_id', $classId)
            ->where('day', $day)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('is_active', true)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($q2) use ($startTime, $endTime) {
                        $q2->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query;
    }
}
