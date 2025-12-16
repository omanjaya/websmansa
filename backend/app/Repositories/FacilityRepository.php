<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Facility;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

final class FacilityRepository extends BaseRepository
{
    public function __construct(Facility $model)
    {
        parent::__construct($model);
    }

    public function active(): Collection
    {
        return $this->model->active()
            ->with(['user'])
            ->ordered()
            ->get();
    }

    public function featured(): Collection
    {
        return $this->model->active()
            ->featured()
            ->with(['user'])
            ->ordered()
            ->limit(6)
            ->get();
    }

    // Removed: Now using BaseRepository::findBySlug()

    /**
     * Apply filters specific to Facility model
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

        if (isset($filters['has_booking'])) {
            if ($filters['has_booking']) {
                $query->whereNotNull('booking_url')->where('booking_url', '!=', '');
            } else {
                $query->where(function ($q) {
                    $q->whereNull('booking_url')->orWhere('booking_url', '');
                });
            }
        }

        if (isset($filters['min_capacity'])) {
            $query->where('capacity', '>=', $filters['min_capacity']);
        }

        if (isset($filters['max_capacity'])) {
            $query->where('capacity', '<=', $filters['max_capacity']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('description', 'like', '%'.$filters['search'].'%')
                    ->orWhere('location', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query;
    }

    public function getByCategory(string $category): Collection
    {
        return $this->model->active()
            ->byCategory($category)
            ->with(['user'])
            ->ordered()
            ->get();
    }

    public function getOrdered(): Collection
    {
        return $this->model->active()
            ->with(['user'])
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
            'classroom', 'laboratory', 'library', 'sports', 'canteen',
            'health', 'auditorium', 'multipurpose', 'parking', 'worship',
            'toilet', 'garden', 'computer', 'science', 'language',
            'art', 'music',
        ];

        $result = [];
        foreach ($categories as $category) {
            $result[$category] = $counts[$category] ?? 0;
        }

        return $result;
    }

    public function getWithBookable(): Collection
    {
        return $this->model->active()
            ->with(['user'])
            ->whereNotNull('booking_url')
            ->ordered()
            ->get();
    }

    public function getBookable(): Collection
    {
        return $this->model->active()
            ->with(['user'])
            ->whereNotNull('booking_url')
            ->ordered()
            ->get();
    }

    public function getByCapacityRange(int $min, int $max): Collection
    {
        return $this->model->active()
            ->whereBetween('capacity', [$min, $max])
            ->with(['user'])
            ->ordered()
            ->get();
    }

    public function getWithArea(): Collection
    {
        return $this->model->active()
            ->whereNotNull('area')
            ->with(['user'])
            ->ordered()
            ->get();
    }

    public function getLargest(int $limit = 5): Collection
    {
        return $this->model->active()
            ->whereNotNull('area')
            ->with(['user'])
            ->orderBy('area', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getPopular(int $limit = 5): Collection
    {
        // For now, return featured facilities
        // In a real app, this would be based on usage/bookings
        return $this->model->active()
            ->featured()
            ->with(['user'])
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    public function getTotalArea(): int
    {
        return $this->model->active()
            ->whereNotNull('area')
            ->sum('area');
    }

    public function getAverageCapacity(): float
    {
        return $this->model->active()
            ->whereNotNull('capacity')
            ->avg('capacity') ?? 0;
    }

    public function getTotalCapacity(): int
    {
        return $this->model->active()
            ->whereNotNull('capacity')
            ->sum('capacity');
    }

    public function getActiveCount(): int
    {
        return $this->model->active()->count();
    }

    public function getBookableCount(): int
    {
        return $this->model->active()
            ->whereNotNull('booking_url')
            ->count();
    }

    public function getFeaturedCount(): int
    {
        return $this->model->active()
            ->where('is_featured', true)
            ->count();
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

    public function getInCategory(string $category, ?string $search = null): Collection
    {
        $query = $this->model->active()
            ->byCategory($category)
            ->with(['user'])
            ->ordered();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', '%'.$search.'%')
                    ->orWhere('description', 'LIKE', '%'.$search.'%');
            });
        }

        return $query->get();
    }

    public function getFilteredByCategory(string $category, array $filters): Collection
    {
        $query = $this->model->active()
            ->byCategory($category)
            ->with(['user']);

        // Apply additional filters
        if (isset($filters['bookable'])) {
            if ($filters['bookable']) {
                $query->whereNotNull('booking_url');
            }
        }

        if (isset($filters['min_capacity'])) {
            $query->where('capacity', '>=', $filters['min_capacity']);
        }

        if (isset($filters['max_capacity'])) {
            $query->where('capacity', '<=', $filters['max_capacity']);
        }

        if (! empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'LIKE', '%'.$filters['search'].'%')
                    ->orWhere('description', 'LIKE', '%'.$filters['search'].'%');
            });
        }

        return $query->ordered()->get();
    }
}
