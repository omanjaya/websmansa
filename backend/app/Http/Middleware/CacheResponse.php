<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheResponse
{
    /**
     * Cache duration mapping by route pattern (in minutes)
     */
    private array $cacheDurations = [
        'staff' => 10,        // Staff data - 10 minutes
        'posts' => 5,         // Posts - 5 minutes
        'announcements' => 5, // Announcements - 5 minutes
        'galleries' => 10,    // Galleries - 10 minutes
        'facilities' => 15,   // Facilities - 15 minutes
        'extras' => 15,       // Extracurriculars - 15 minutes
        'sliders' => 10,      // Sliders - 10 minutes
        'settings' => 30,     // Settings - 30 minutes
        'categories' => 30,   // Categories - 30 minutes
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, int $minutes = 5): Response
    {
        // Prevent PHP session from setting cache headers
        if (session_status() === PHP_SESSION_NONE) {
            session_cache_limiter('');
        }

        $response = $next($request);

        // Only cache GET requests
        if ($request->method() !== 'GET') {
            return $response;
        }

        // Don't cache authenticated requests or requests with Authorization header
        if ($request->user() || $request->hasHeader('Authorization')) {
            $response->headers->set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            return $response;
        }

        // Don't cache admin routes
        if (str_contains($request->path(), 'admin')) {
            $response->headers->set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            return $response;
        }

        // Determine cache duration based on route
        $cacheDuration = $this->getCacheDuration($request->path(), $minutes);

        // Remove any existing cache headers first
        $response->headers->remove('Cache-Control');
        $response->headers->remove('Pragma');

        // Add cache headers
        $response->headers->set('Cache-Control', "public, max-age=" . ($cacheDuration * 60) . ", s-maxage=" . ($cacheDuration * 60 * 2));
        $response->headers->set('Vary', 'Accept-Encoding, Accept');

        // Add ETag for conditional requests
        if ($response->getContent()) {
            $etag = md5($response->getContent());
            $response->headers->set('ETag', '"' . $etag . '"');

            // Check If-None-Match header
            $ifNoneMatch = $request->header('If-None-Match');
            if ($ifNoneMatch && $ifNoneMatch === '"' . $etag . '"') {
                $response->setStatusCode(304);
                $response->setContent('');
            }
        }

        return $response;
    }

    /**
     * Get cache duration based on route pattern
     */
    private function getCacheDuration(string $path, int $default): int
    {
        foreach ($this->cacheDurations as $pattern => $duration) {
            if (str_contains($path, $pattern)) {
                return $duration;
            }
        }
        return $default;
    }
}
