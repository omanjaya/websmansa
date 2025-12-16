<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class AnnouncementRepository extends BaseRepository
{
    public function __construct(Announcement $model)
    {
        parent::__construct($model);
    }

    public function published(): Collection
    {
        return $this->model->published()
            ->with(['user', 'category'])
            ->orderBy('is_pinned', 'desc')
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();
    }

    public function featured(): Collection
    {
        return $this->model->published()
            ->featured()
            ->with(['user', 'category'])
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit(5)
            ->get();
    }

    public function active(): Collection
    {
        return $this->model->active()
            ->with(['user', 'category'])
            ->latest('published_at')
            ->get();
    }

    // Removed: Now using BaseRepository::findBySlug()

    /**
     * Apply filters specific to Announcement model
     */
    protected function applyFilters(\Illuminate\Database\Eloquent\Builder $query, array $filters): \Illuminate\Database\Eloquent\Builder
    {
        if (isset($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['is_pinned'])) {
            $query->where('is_pinned', $filters['is_pinned']);
        }

        if (isset($filters['is_active'])) {
            if ($filters['is_active']) {
                $query->active();
            } else {
                $query->where('is_active', false);
            }
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('content', 'like', '%'.$filters['search'].'%')
                    ->orWhere('excerpt', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query;
    }

    /**
     * Custom ordering for announcements
     */
    protected function applyOrdering(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->orderBy('is_pinned', 'desc')
            ->orderBy('priority', 'desc')
            ->latest('published_at');
    }

    public function getByType(string $type): Collection
    {
        return $this->model->published()
            ->byType($type)
            ->with(['user', 'category'])
            ->latest('published_at')
            ->get();
    }

    public function getByPriority(string $priority): Collection
    {
        return $this->model->published()
            ->where('priority', $priority)
            ->with(['user', 'category'])
            ->latest('published_at')
            ->get();
    }

    public function getPinned(): Collection
    {
        return $this->model->published()
            ->where('is_pinned', true)
            ->with(['user', 'category'])
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc')
            ->get();
    }

    public function getActiveByType(string $type): Collection
    {
        return $this->model->active()
            ->byType($type)
            ->with(['user', 'category'])
            ->latest('published_at')
            ->get();
    }

    public function getExpired(): Collection
    {
        return $this->model->expired()
            ->with(['user', 'category'])
            ->latest('expires_at')
            ->get();
    }

    public function countByType(): array
    {
        $counts = $this->model->published()
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        $types = ['info', 'event', 'warning', 'success'];
        $result = [];

        foreach ($types as $type) {
            $result[$type] = $counts[$type] ?? 0;
        }

        return $result;
    }

    public function getRecent(int $limit = 5): Collection
    {
        return $this->model->published()
            ->with(['user', 'category'])
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function getActiveCount(): int
    {
        return $this->model->published()
            ->where('expires_at', '>', now())
            ->orWhereNull('expires_at')
            ->count();
    }

    public function cleanupExpired(): int
    {
        return $this->model->expired()->delete();
    }
}
