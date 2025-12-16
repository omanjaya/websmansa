<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Extra;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class ExtraRepository extends BaseRepository
{
    public function __construct(Extra $model)
    {
        parent::__construct($model);
    }

    public function active(): Collection
    {
        return $this->model->active()
            ->with(['user', 'members'])
            ->ordered()
            ->get();
    }

    public function featured(): Collection
    {
        return $this->model->active()
            ->featured()
            ->with(['user', 'members'])
            ->ordered()
            ->limit(6)
            ->get();
    }

    // Removed: Now using BaseRepository::findBySlug()

    /**
     * Apply filters specific to Extra model
     */
    protected function applyFilters(\Illuminate\Database\Eloquent\Builder $query, array $filters): \Illuminate\Database\Eloquent\Builder
    {
        if (isset($filters['category'])) {
            $query->byCategory($filters['category']);
        }

        if (isset($filters['is_active'])) {
            if ($filters['is_active']) {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        }

        if (isset($filters['is_featured'])) {
            if ($filters['is_featured']) {
                $query->featured();
            } else {
                $query->where('is_featured', false);
            }
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description', 'like', '%'.$filters['search'].'%')
                    ->orWhere('short_description', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query;
    }

    public function getByCategory(string $category): Collection
    {
        return $this->model->active()
            ->byCategory($category)
            ->with(['user', 'members'])
            ->ordered()
            ->get();
    }

    public function getOrdered(): Collection
    {
        return $this->model->active()
            ->with(['user', 'members'])
            ->ordered()
            ->get();
    }

    public function countByCategory(): array
    {
        $counts = $this->model->active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        $categories = [
            'sports', 'arts', 'academic', 'social', 'technology',
            'language', 'leadership', 'volunteer', 'religious',
        ];

        $result = [];
        foreach ($categories as $category) {
            $result[$category] = $counts[$category] ?? 0;
        }

        return $result;
    }

    public function getWithMemberCount(): Collection
    {
        return $this->model->active()
            ->withCount('members')
            ->with(['user'])
            ->ordered()
            ->get();
    }

    public function getPopular(int $limit = 5): Collection
    {
        return $this->model->active()
            ->withCount('members')
            ->with(['user'])
            ->orderBy('members_count', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    public function getAvailableSlots(int $extraId): int
    {
        $extra = $this->model->find($extraId);

        if (! $extra || ! $extra->capacity) {
            return 999;
        }

        return $extra->getAvailableSlots();
    }

    public function getForMember(int $userId): Collection
    {
        return $this->model->active()
            ->whereHas('members', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->with(['user', 'members' => function ($q) use ($userId) {
                $q->where('user_id', $userId);
            }])
            ->ordered()
            ->get();
    }

    public function addUser(int $extraId, int $userId, string $role = 'member'): bool
    {
        $extra = $this->model->find($extraId);

        if (! $extra) {
            return false;
        }

        // Check if user is already a member
        if ($extra->members()->where('user_id', $userId)->exists()) {
            return false;
        }

        // Check capacity
        if ($extra->capacity && $extra->members()->count() >= $extra->capacity) {
            return false;
        }

        return $extra->members()->attach($userId, [
            'role' => $role,
            'joined_at' => now(),
        ]);
    }

    public function removeUser(int $extraId, int $userId): bool
    {
        $extra = $this->model->find($extraId);

        if (! $extra) {
            return false;
        }

        return $extra->members()->detach($userId);
    }

    public function updateMemberRole(int $extraId, int $userId, string $role): bool
    {
        $extra = $this->model->find($extraId);

        if (! $extra) {
            return false;
        }

        return $extra->members()->updateExistingPivot($userId, [
            'role' => $role,
        ]);
    }

    public function getRecent(): Collection
    {
        return $this->model->active()
            ->featured()
            ->with(['user'])
            ->latest('created_at')
            ->limit(6)
            ->get();
    }

    public function getActiveCount(): int
    {
        return $this->model->active()->count();
    }

    public function getTotalMembers(): int
    {
        return \DB::table('extra_members')->count();
    }

    public function getAverageMembers(): float
    {
        $totalExtras = $this->getActiveCount();
        $totalMembers = $this->getTotalMembers();

        return $totalExtras > 0 ? $totalMembers / $totalExtras : 0;
    }
}
