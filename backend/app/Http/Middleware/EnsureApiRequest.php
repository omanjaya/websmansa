<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureApiRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure the request is JSON
        if ($request->isMethod('POST') &&
            ! $request->expectsJson() &&
            ! $request->is('api/*')) {
            return response()->json([
                'message' => 'Invalid request. Please use JSON content type.',
                'errors' => [
                    'content_type' => ['Content-Type must be application/json'],
                ],
            ], 400);
        }

        return $next($request);
    }
}
