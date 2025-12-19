<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string $subject
 * @property string $message
 * @property string $status
 * @property string|null $admin_notes
 * @property int|null $replied_by
 * @property \Carbon\Carbon|null $replied_at
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'admin_notes',
        'replied_by',
        'replied_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    public const STATUS_UNREAD = 'unread';
    public const STATUS_READ = 'read';
    public const STATUS_REPLIED = 'replied';
    public const STATUS_ARCHIVED = 'archived';

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (ContactMessage $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the user who replied to this message.
     */
    public function repliedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replied_by');
    }

    /**
     * Scope unread messages.
     */
    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_UNREAD);
    }

    /**
     * Scope read messages.
     */
    public function scopeRead(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_READ);
    }

    /**
     * Scope replied messages.
     */
    public function scopeReplied(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_REPLIED);
    }

    /**
     * Scope archived messages.
     */
    public function scopeArchived(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ARCHIVED);
    }

    /**
     * Mark as read.
     */
    public function markAsRead(): bool
    {
        if ($this->status === self::STATUS_UNREAD) {
            return $this->update(['status' => self::STATUS_READ]);
        }
        return false;
    }

    /**
     * Mark as replied.
     */
    public function markAsReplied(?string $notes = null): bool
    {
        return $this->update([
            'status' => self::STATUS_REPLIED,
            'replied_by' => auth()->id(),
            'replied_at' => now(),
            'admin_notes' => $notes ?? $this->admin_notes,
        ]);
    }

    /**
     * Archive the message.
     */
    public function archive(): bool
    {
        return $this->update(['status' => self::STATUS_ARCHIVED]);
    }

    /**
     * Get status label in Indonesian.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_UNREAD => 'Belum Dibaca',
            self::STATUS_READ => 'Sudah Dibaca',
            self::STATUS_REPLIED => 'Sudah Dibalas',
            self::STATUS_ARCHIVED => 'Diarsipkan',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get status color.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_UNREAD => 'red',
            self::STATUS_READ => 'blue',
            self::STATUS_REPLIED => 'green',
            self::STATUS_ARCHIVED => 'gray',
            default => 'gray',
        };
    }

    /**
     * Check if message is unread.
     */
    public function isUnread(): bool
    {
        return $this->status === self::STATUS_UNREAD;
    }
}
