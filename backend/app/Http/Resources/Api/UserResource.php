<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'type' => 'user',
            'attributes' => [
                'name' => $this->name,
                'email' => $this->when(
                    $this->shouldShowEmail($request),
                    $this->email
                ),
                'avatar' => $this->when(
                    $this->avatar,
                    fn () => asset("storage/{$this->avatar}")
                ),
                'bio' => $this->when($this->bio, $this->bio),
                'roles' => $this->when($this->relationLoaded('roles'), fn () => collect($this->roles)->pluck('name')
                ),
                'permissions' => $this->when($this->relationLoaded('permissions'), fn () => collect($this->permissions)->pluck('name')
                ),
                'created_at' => $this->created_at->toIso8601String(),
                'updated_at' => $this->updated_at->toIso8601String(),
            ],
            'meta' => [
                'is_admin' => $this->when($this->relationLoaded('roles'), fn () => $this->hasRole('admin')
                ),
                'is_editor' => $this->when($this->relationLoaded('roles'), fn () => $this->hasRole('editor')
                ),
                'last_login' => $this->when($this->last_login_at,
                    fn () => $this->last_login_at->toIso8601String()
                ),
            ],
        ];
    }

    /**
     * Determine if email should be shown
     */
    private function shouldShowEmail(Request $request): bool
    {
        // Show email for profile view, own profile, or admin
        return $request->routeIs('api.auth.me') ||
               $request->user()?->id === $this->id ||
               $request->user()?->hasRole('admin');
    }

    /**
     * Check if user has specific role
     */
    private function hasRole(string $role): bool
    {
        if (! $this->relationLoaded('roles')) {
            return false;
        }

        return collect($this->roles)->contains('name', $role);
    }
}
