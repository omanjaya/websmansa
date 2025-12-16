<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(): Collection
    {
        return $this->model->all();
    }

    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    public function findByUuid(string $uuid): ?Model
    {
        return $this->model->where('uuid', $uuid)->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $model = $this->find($id);

        if (! $model) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Model not found');
        }

        $model->update($data);

        return $model->fresh();
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id) > 0;
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    public function where(string $column, mixed $operator, mixed $value = null): Builder
    {
        return $this->model->where($column, $operator, $value);
    }

    public function with(array|string $relations): Builder
    {
        return $this->model->newQuery()->with($relations);
    }

    public function latest(string $column = 'created_at'): Builder
    {
        return $this->model->newQuery()->latest($column);
    }

    public function orderBy(string $column, string $direction = 'asc'): Builder
    {
        return $this->model->newQuery()->orderBy($column, $direction);
    }

    /**
     * Get a new query builder instance
     */
    public function query(): Builder
    {
        return $this->model->newQuery();
    }

    /**
     * Find model by slug
     */
    public function findBySlug(string $slug, array $relations = []): ?Model
    {
        return $this->model->newQuery()
            ->with($relations)
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Get filtered and paginated results
     */
    public function getFiltered(
        array $filters = [],
        array $relations = [],
        int $perPage = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        $query = $this->model->newQuery()->with($relations);

        // Apply filters via template method (can be overridden by child repos)
        $query = $this->applyFilters($query, $filters);

        // Apply ordering via template method (can be overridden by child repos)
        $query = $this->applyOrdering($query);

        return $paginate
            ? $query->paginate($perPage)
            : $query->limit($perPage)->get();
    }

    /**
     * Get featured items
     */
    public function getFeatured(int $limit = 6, array $relations = []): Collection
    {
        $query = $this->model->newQuery()->with($relations);

        // Apply featured scope if available
        if (method_exists($this->model, 'scopeFeatured')) {
            $query->featured();
        } else {
            $query->where('is_featured', true);
        }

        // Apply active scope if available
        if (method_exists($this->model, 'scopeActive')) {
            $query->active();
        }

        // Apply ordering
        $query = $this->applyOrdering($query);

        return $query->limit($limit)->get();
    }

    /**
     * Toggle a boolean field on a model
     */
    public function toggleField(Model $entity, string $field): Model
    {
        $entity->update([$field => ! $entity->$field]);
        return $entity->fresh();
    }

    /**
     * Template method for applying filters - override in child repositories
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        // Default implementation - simple where clauses
        foreach ($filters as $key => $value) {
            if ($value !== null && $value !== '') {
                $query->where($key, $value);
            }
        }

        return $query;
    }

    /**
     * Template method for applying ordering - override in child repositories
     */
    protected function applyOrdering(Builder $query): Builder
    {
        // Default ordering - check for ordered() scope, otherwise latest()
        if (method_exists($this->model, 'scopeOrdered')) {
            return $query->ordered();
        }

        return $query->latest();
    }
}
