<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int|null $user_id
 * @property string $action
 * @property string|null $model_type
 * @property int|null $model_id
 * @property string $description
 * @property array|null $old_values
 * @property array|null $new_values
 * @property array|null $metadata
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'user_id',
        'action',
        'model_type',
        'model_id',
        'description',
        'old_values',
        'new_values',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (ActivityLog $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the user who performed the action.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subject of the activity.
     */
    public function subject(): MorphTo
    {
        return $this->morphTo('model');
    }

    /**
     * Log an activity.
     * 
     * @param string $action
     * @param string $description
     * @param Model|null $subject
     * @param array<string, mixed>|null $oldValues
     * @param array<string, mixed>|null $newValues
     * @param array<string, mixed>|null $metadata
     * @return static
     */
    public static function log(
        string $action,
        string $description,
        ?Model $subject = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?array $metadata = null
    ): static {
        $request = request();
        
        return static::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $subject ? get_class($subject) : null,
            'model_id' => $subject?->getKey(),
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $metadata,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    /**
     * Get action label in Indonesian.
     */
    public function getActionLabelAttribute(): string
    {
        return match ($this->action) {
            'create' => 'Membuat',
            'update' => 'Mengubah',
            'delete' => 'Menghapus',
            'login' => 'Login',
            'logout' => 'Logout',
            'upload' => 'Mengunggah',
            'download' => 'Mengunduh',
            'publish' => 'Mempublikasi',
            'unpublish' => 'Membatalkan Publikasi',
            'archive' => 'Mengarsipkan',
            'restore' => 'Memulihkan',
            default => ucfirst($this->action),
        };
    }

    /**
     * Get model type label.
     */
    public function getModelTypeLabelAttribute(): ?string
    {
        if (!$this->model_type) {
            return null;
        }

        $class = class_basename($this->model_type);
        
        return match ($class) {
            'Post' => 'Berita',
            'Announcement' => 'Pengumuman',
            'Gallery' => 'Galeri',
            'Staff' => 'Staff',
            'Extra' => 'Ekstrakurikuler',
            'Facility' => 'Fasilitas',
            'Slider' => 'Slider',
            'Alumni' => 'Alumni',
            'Achievement' => 'Prestasi',
            'User' => 'Pengguna',
            'Setting' => 'Pengaturan',
            'ContactMessage' => 'Pesan Kontak',
            'Schedule' => 'Jadwal',
            default => $class,
        };
    }

    /**
     * Get icon for the action.
     */
    public function getIconAttribute(): string
    {
        return match ($this->action) {
            'create' => 'plus-circle',
            'update' => 'edit',
            'delete' => 'trash-2',
            'login' => 'log-in',
            'logout' => 'log-out',
            'upload' => 'upload',
            'download' => 'download',
            'publish' => 'check-circle',
            'unpublish' => 'x-circle',
            'archive' => 'archive',
            'restore' => 'rotate-ccw',
            default => 'activity',
        };
    }

    /**
     * Get color for the action.
     */
    public function getColorAttribute(): string
    {
        return match ($this->action) {
            'create' => 'green',
            'update' => 'blue',
            'delete' => 'red',
            'login' => 'purple',
            'logout' => 'gray',
            'upload' => 'cyan',
            'publish' => 'green',
            'unpublish' => 'yellow',
            'archive' => 'orange',
            'restore' => 'teal',
            default => 'gray',
        };
    }
}
