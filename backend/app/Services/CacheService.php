<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;

final class CacheService
{
    private const DEFAULT_TTL = 3600; // 1 hour

    public function remember(string $key, int $ttl, callable $callback): mixed
    {
        return Cache::remember($key, $ttl, $callback);
    }

    public function rememberForever(string $key, callable $callback): mixed
    {
        return Cache::rememberForever($key, $callback);
    }

    public function put(string $key, mixed $value, ?int $ttl = null): bool
    {
        return Cache::put($key, $value, $ttl ?? self::DEFAULT_TTL);
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return Cache::get($key, $default);
    }

    public function has(string $key): bool
    {
        return Cache::has($key);
    }

    public function forget(string $key): bool
    {
        return Cache::forget($key);
    }

    public function flush(): bool
    {
        return Cache::flush();
    }

    public function tags(array $tags): self
    {
        // This would be implemented with cache tags in production
        return $this;
    }

    public function rememberWithTags(string $key, array $tags, int $ttl, callable $callback): mixed
    {
        return Cache::tags($tags)->remember($key, $ttl, $callback);
    }

    public function putWithTags(string $key, mixed $value, array $tags, ?int $ttl = null): bool
    {
        return Cache::tags($tags)->put($key, $value, $ttl ?? self::DEFAULT_TTL);
    }

    public function forgetWithTags(array $tags): bool
    {
        return Cache::tags($tags)->flush();
    }

    public function generateKey(string $prefix, array $params = []): string
    {
        $paramString = empty($params) ? '' : '.'.md5(serialize($params));

        return "{$prefix}{$paramString}";
    }
}
