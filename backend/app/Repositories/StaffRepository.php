<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class StaffRepository extends BaseRepository
{
    public function __construct(Staff $model)
    {
        parent::__construct($model);
    }

    /**
     * Apply filters specific to Staff model
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (isset($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (isset($filters['department'])) {
            $query->byDepartment($filters['department']);
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
                    ->orWhere('position', 'like', '%'.$filters['search'].'%')
                    ->orWhere('department', 'like', '%'.$filters['search'].'%');
            });
        }

        return $query;
    }

    /**
     * Get staff by type (teacher/admin)
     */
    public function getByType(string $type, int $limit = null): Collection
    {
        $query = $this->model->newQuery()
            ->byType($type)
            ->active()
            ->ordered();

        return $limit ? $query->limit($limit)->get() : $query->get();
    }

    /**
     * Get staff by department
     */
    public function getByDepartment(string $department): Collection
    {
        return $this->model->newQuery()
            ->byDepartment($department)
            ->active()
            ->ordered()
            ->get();
    }

    /**
     * Get teachers
     */
    public function getTeachers(int $limit = null): Collection
    {
        return $this->getByType('teacher', $limit);
    }

    /**
     * Get admin staff
     */
    public function getAdminStaff(int $limit = null): Collection
    {
        return $this->getByType('admin', $limit);
    }
}
