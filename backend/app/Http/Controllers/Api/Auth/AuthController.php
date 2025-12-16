<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\LogoutRequest;
use App\Http\Resources\Api\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class AuthController extends Controller
{
    /**
     * Login user and return token
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        // Revoke all previous tokens
        $user->tokens()->delete();

        // Create new token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => new UserResource($user),
                'token' => $token,
                'expires_at' => now()->addMinutes(config('sanctum.expiration', 525600)),
            ],
        ]);
    }

    /**
     * Logout user and revoke token
     */
    public function logout(LogoutRequest $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request): JsonResource
    {
        return new UserResource($request->user()->load(['roles', 'permissions']));
    }

    /**
     * Refresh authentication token
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();

        // Revoke current token
        $user->currentAccessToken()->delete();

        // Create new token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'expires_at' => now()->addMinutes(config('sanctum.expiration', 525600)),
            ],
        ]);
    }
}
