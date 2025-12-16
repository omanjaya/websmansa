<?php

declare(strict_types=1);

namespace App\Enums;

enum PostType: string
{
    case NEWS = 'news';
    case ANNOUNCEMENT = 'announcement';
    case ACHIEVEMENT = 'achievement';
    case PAGE = 'page';

    public function label(): string
    {
        return match ($this) {
            self::NEWS => 'Berita',
            self::ANNOUNCEMENT => 'Pengumuman',
            self::ACHIEVEMENT => 'Prestasi',
            self::PAGE => 'Halaman',
        };
    }

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
