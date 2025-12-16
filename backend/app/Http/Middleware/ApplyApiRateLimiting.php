<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

final class ApplyApiRateLimiting
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->resolveRequestSignature($request);
        $limit = $this->resolveRequestLimit($request);
        $decay = 60; // 1 minute

        if (RateLimiter::tooManyAttempts($key, $limit)) {
            $seconds = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'Too many requests. Please try again later.',
                'errors' => [
                    'rate_limit' => [
                        "Rate limit exceeded. Try again in {$seconds} seconds.",
                    ],
                ],
                'meta' => [
                    'retry_after' => $seconds,
                    'limit' => $limit,
                ],
            ], 429)
                ->header('X-RateLimit-Limit', $limit)
                ->header('X-RateLimit-Remaining', 0)
                ->header('X-RateLimit-Reset', now()->addSeconds($seconds)->getTimestamp());
        }

        RateLimiter::hit($key, $decay);
        $remaining = RateLimiter::remaining($key, $limit);

        $response = $next($request);

        return $response
            ->header('X-RateLimit-Limit', $limit)
            ->header('X-RateLimit-Remaining', max(0, $remaining))
            ->header('X-RateLimit-Reset', now()->addMinutes(1)->getTimestamp());
    }

    /**
     * Resolve request signature for rate limiting
     */
    private function resolveRequestSignature(Request $request): string
    {
        $user = $request->user();

        if ($user) {
            // Authenticated user
            return "api:{$user->id}:{$request->ip()}:{$request->fingerprint()}";
        }

        // Guest user
        return "api:guest:{$request->ip()}:{$request->fingerprint()}";
    }

    /**
     * Resolve rate limit based on user and endpoint
     */
    private function resolveRequestLimit(Request $request): int
    {
        $user = $request->user();

        if (! $user) {
            // Public endpoints
            return 60; // 60 requests per minute
        }

        if ($user->hasRole('admin')) {
            // Admin users
            return 240; // 240 requests per minute
        }

        // Authenticated users
        return 120; // 120 requests per minute
    }
}
