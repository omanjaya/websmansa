<?php

declare(strict_types=1);

namespace App\Models;

use App\Services\MediaProcessingService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

final class Staff extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $table = 'staff';

    protected $fillable = [
        'nip',
        'name',
        'slug',
        'photo',
        'position',
        'department',
        'subjects',
        'qualifications',
        'experience',
        'email',
        'phone',
        'social_media',
        'bio',
        'achievements',
        'is_active',
        'is_featured',
        'order',
        'type',
        'user_id',
    ];

    protected $casts = [
        'subjects' => 'array',
        'qualifications' => 'array',
        'social_media' => 'array',
        'achievements' => 'array',
        'experience' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByDepartment(Builder $query, string $department): Builder
    {
        return $query->where('department', $department);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('order')->orderBy('name');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFullNameAttribute(): string
    {
        return $this->name;
    }

    public function getFormalNameAttribute(): string
    {
        if ($this->nip && $this->name) {
            return $this->nip.', '.$this->name;
        }

        return $this->name;
    }

    public function getTypeLabel(): string
    {
        return match ($this->type) {
            'teacher' => 'Guru',
            'admin' => 'Tata Usaha',
            'staff' => 'Pegawai',
            'headmaster' => 'Kepala Sekolah',
            'vice_headmaster' => 'Wakil Kepala Sekolah',
            'counselor' => 'Bimbingan Konseling',
            'librarian' => 'Pustakawan',
            'lab_assistant' => 'Asisten Laboratorium',
            'security' => 'Satpam',
            'cleaner' => 'Pramubakti',
            'cafeteria' => 'Karyawan Kantin',
            default => 'Staff',
        };
    }

    public function getDepartmentLabel(): string
    {
        return match ($this->department) {
            'mathematics' => 'Matematika',
            'indonesian' => 'Bahasa Indonesia',
            'english' => 'Bahasa Inggris',
            'physics' => 'Fisika',
            'chemistry' => 'Kimia',
            'biology' => 'Biologi',
            'history' => 'Sejarah',
            'geography' => 'Geografi',
            'economics' => 'Ekonomi',
            'sociology' => 'Sosiologi',
            'civics' => 'PKN',
            'religion' => 'Pendidikan Agama',
            'art' => 'Seni Budaya',
            'music' => 'Musik',
            'pe' => 'Pendidikan Jasmani',
            'it' => 'Teknologi Informasi',
            'counseling' => 'Bimbingan Konseling',
            'library' => 'Perpustakaan',
            'laboratory' => 'Laboratorium',
            'administration' => 'Tata Usaha',
            'finance' => 'Keuangan',
            'student_affairs' => 'Kesiswaan',
            'curriculum' => 'Kurikulum',
            'facilities' => 'Sarana Prasarana',
            'public_relation' => 'Humas',
            'security' => 'Keamanan',
            'cleaning' => 'Kebersihan',
            'cafeteria' => 'Kantin',
            'health' => 'UKS',
            default => 'Lainnya',
        };
    }

    public function getSubjectsList(): array
    {
        return $this->subjects ?? [];
    }

    public function getQualificationsList(): array
    {
        return $this->qualifications ?? [];
    }

    public function getAchievementsList(): array
    {
        return $this->achievements ?? [];
    }

    public function getSocialMediaLinks(): array
    {
        return $this->social_media ?? [];
    }

    public function getExperienceFormatted(): string
    {
        $years = $this->experience ?? 0;

        if ($years === 0) {
            return 'Baru';
        }

        if ($years === 1) {
            return '1 tahun';
        }

        return $years.' tahun';
    }

    public function hasPhoto(): bool
    {
        return ! empty($this->photo);
    }

    public function getPhotoUrl(string $size = 'thumb'): ?string
    {
        $media = $this->getFirstMedia('photo');

        if ($media) {
            return $media->hasGeneratedConversion($size)
                ? $media->getUrl($size)
                : $media->getUrl();
        }

        if ($this->hasPhoto()) {
            return asset("storage/{$this->photo}");
        }

        return null;
    }

    public function hasContactInfo(): bool
    {
        return ! empty($this->email) || ! empty($this->phone);
    }

    public function getDisplayPhone(): ?string
    {
        $phone = $this->phone;

        if (empty($phone)) {
            return null;
        }

        // Format Indonesian phone number
        if (str_starts_with($phone, '0')) {
            return $phone;
        }

        if (str_starts_with($phone, '62')) {
            return '0'.substr($phone, 2);
        }

        return $phone;
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(150)->height(150)->sharpen(10)->format('webp')->quality(85)->nonQueued();
        $this->addMediaConversion('thumb-jpg')
            ->width(150)->height(150)->sharpen(10)->format('jpg')->quality(85)->nonQueued();
        $this->addMediaConversion('medium')
            ->width(400)->format('webp')->quality(85)->nonQueued();
        $this->addMediaConversion('medium-jpg')
            ->width(400)->format('jpg')->quality(85)->nonQueued();
        $this->addMediaConversion('large')
            ->width(800)->format('webp')->quality(90)->nonQueued();
        $this->addMediaConversion('large-jpg')
            ->width(800)->format('jpg')->quality(90)->nonQueued();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
            ->useDisk('public');
    }

    public function getOptimizedPhoto(string $size = 'medium'): array
    {
        $media = $this->getFirstMedia('photo');
        
        if ($media) {
            return MediaProcessingService::getImageUrls($media, $size);
        }

        if ($this->hasPhoto()) {
            $url = asset("storage/{$this->photo}");
            return ['webp' => $url, 'jpg' => $url, 'original' => $url, 'thumb' => $url];
        }

        return ['webp' => null, 'jpg' => null, 'original' => null, 'thumb' => null];
    }
}
