<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware to authenticate using token from HTTP-only cookie
 *
 * This middleware reads the auth_token from cookie and adds it
 * to the Authorization header so Sanctum can authenticate the request.
 */
final class AuthenticateFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If Authorization header is not present but cookie is, use cookie token
        if (!$request->bearerToken() && $request->cookie('auth_token')) {
            $token = $request->cookie('auth_token');

            // Add Authorization header with token from cookie
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
