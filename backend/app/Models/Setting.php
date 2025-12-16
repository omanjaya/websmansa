<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting.{$key}", 3600, function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            
            if (!$setting) {
                return $default;
            }

            return self::castValue($setting->value, $setting->type);
        });
    }

    /**
     * Set a setting value.
     */
    public static function set(string $key, $value, string $type = 'string', string $group = 'general'): void
    {
        self::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : $value,
                'type' => $type,
                'group' => $group,
            ]
        );

        Cache::forget("setting.{$key}");
    }

    /**
     * Get all settings as key-value pairs.
     */
    public static function getAll(): array
    {
        return Cache::remember('settings.all', 3600, function () {
            return self::all()->mapWithKeys(function ($setting) {
                return [$setting->key => self::castValue($setting->value, $setting->type)];
            })->toArray();
        });
    }

    /**
     * Get settings by group.
     */
    public static function getByGroup(string $group): array
    {
        return Cache::remember("settings.group.{$group}", 3600, function () use ($group) {
            return self::where('group', $group)->get()->mapWithKeys(function ($setting) {
                return [$setting->key => self::castValue($setting->value, $setting->type)];
            })->toArray();
        });
    }

    /**
     * Cast value to appropriate type.
     */
    protected static function castValue($value, string $type)
    {
        return match ($type) {
            'boolean' => (bool) $value,
            'integer' => (int) $value,
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Clear settings cache.
     */
    public static function clearCache(): void
    {
        Cache::flush();
    }
}
