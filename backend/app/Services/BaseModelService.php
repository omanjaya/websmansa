<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

abstract class BaseModelService
{
    protected BaseRepository $repository;
    protected array $defaultRelations = [];
    protected string $slugSourceField = 'name'; // or 'title'
    protected int $cacheTTL = 600; // 10 minutes default
    protected string $cachePrefix = '';

    public function __construct(BaseRepository $repository)
    {
        $this->repository = $repository;
        $this->cachePrefix = Str::snake(class_basename(static::class));
    }

    /**
     * Generate cache key for queries
     */
    protected function getCacheKey(string $method, array $params = []): string
    {
        return $this->cachePrefix . ':' . $method . ':' . md5(serialize($params));
    }

    /**
     * Clear cache for this service
     */
    public function clearCache(): void
    {
        Cache::tags([$this->cachePrefix])->flush();
    }

    /**
     * Get model by slug
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function getBySlug(string $slug): Model
    {
        $entity = $this->repository->findBySlug($slug, $this->defaultRelations);

        if (!$entity) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException(
                "Resource not found with slug: {$slug}"
            );
        }

        return $entity;
    }

    /**
     * Create a new model
     */
    public function create(array $data, ?int $userId = null): Model
    {
        // Auto-generate slug if not provided
        if (empty($data['slug']) && isset($data[$this->slugSourceField])) {
            $data['slug'] = Str::slug($data[$this->slugSourceField]);
        }

        // Set user_id if provided
        if ($userId !== null) {
            $data['user_id'] = $userId;
        }

        // Hook for pre-create modifications
        $data = $this->beforeCreate($data);

        $entity = $this->repository->create($data);

        // Load relationships
        if (!empty($this->defaultRelations)) {
            $entity->load($this->defaultRelations);
        }

        // Hook for post-create actions
        $this->afterCreate($entity, $data);

        // Clear cache after create
        $this->invalidateCache();

        return $entity;
    }

    /**
     * Update an existing model
     */
    public function update(Model $entity, array $data): Model
    {
        // Hook for pre-update modifications
        $data = $this->beforeUpdate($entity, $data);

        $entity = $this->repository->update($entity->id, $data);

        // Load relationships
        if (!empty($this->defaultRelations)) {
            $entity->load($this->defaultRelations);
        }

        // Hook for post-update actions
        $this->afterUpdate($entity, $data);

        // Clear cache after update
        $this->invalidateCache();

        return $entity;
    }

    /**
     * Delete a model
     */
    public function delete(Model $entity): bool
    {
        $result = $this->repository->delete($entity->id);

        // Clear cache after delete
        $this->invalidateCache();

        return $result;
    }

    /**
     * Invalidate all cache for this service
     */
    protected function invalidateCache(): void
    {
        // Clear all cache keys with this prefix pattern
        Cache::forget($this->getCacheKey('featured', ['limit' => 6]));
        Cache::forget($this->getCacheKey('featured', ['limit' => 10]));
        Cache::forget($this->getCacheKey('featured', ['limit' => 12]));
        Cache::forget($this->getCacheKey('filtered', ['filters' => [], 'limit' => 15]));
        Cache::forget($this->getCacheKey('filtered', ['filters' => [], 'limit' => 12]));
    }

    /**
     * Toggle active status
     */
    public function toggleActiveStatus(Model $entity): Model
    {
        return $this->repository->toggleField($entity, 'is_active');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeaturedStatus(Model $entity): Model
    {
        return $this->repository->toggleField($entity, 'is_featured');
    }

    /**
     * Toggle pinned status
     */
    public function togglePinStatus(Model $entity): Model
    {
        return $this->repository->toggleField($entity, 'is_pinned');
    }

    /**
     * Get filtered results with caching
     */
    public function getFiltered(
        array $filters = [],
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        // Don't cache paginated results as they vary by page
        if ($paginate) {
            return $this->repository->getFiltered(
                $filters,
                $this->defaultRelations,
                $limit,
                $paginate
            );
        }

        $cacheKey = $this->getCacheKey('filtered', compact('filters', 'limit'));

        return Cache::remember($cacheKey, $this->cacheTTL, function () use ($filters, $limit, $paginate) {
            return $this->repository->getFiltered(
                $filters,
                $this->defaultRelations,
                $limit,
                $paginate
            );
        });
    }

    /**
     * Get featured items with caching
     */
    public function getFeatured(int $limit = 6): Collection
    {
        $cacheKey = $this->getCacheKey('featured', compact('limit'));

        return Cache::remember($cacheKey, $this->cacheTTL, function () use ($limit) {
            return $this->repository->getFeatured($limit, $this->defaultRelations);
        });
    }

    /**
     * Template method: before create hook
     * Override in child services for custom logic
     */
    protected function beforeCreate(array $data): array
    {
        return $data;
    }

    /**
     * Template method: after create hook
     * Override in child services for custom logic
     */
    protected function afterCreate(Model $entity, array $data): void
    {
        // Empty by default - override in child services
    }

    /**
     * Template method: before update hook
     * Override in child services for custom logic
     */
    protected function beforeUpdate(Model $entity, array $data): array
    {
        return $data;
    }

    /**
     * Template method: after update hook
     * Override in child services for custom logic
     */
    protected function afterUpdate(Model $entity, array $data): void
    {
        // Empty by default - override in child services
    }
}
