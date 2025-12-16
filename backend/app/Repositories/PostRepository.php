<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder;

class PostRepository extends BaseRepository
{
    public function __construct(Post $model)
    {
        parent::__construct($model);
    }

    public function published(): Builder
    {
        return $this->model->published();
    }

    // Removed: Now using BaseRepository::findBySlug()

    /**
     * Apply filters specific to Post model
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('excerpt', 'like', '%'.$filters['search'].'%')
                    ->orWhere('content', 'like', '%'.$filters['search'].'%');
            });
        }

        if (isset($filters['category'])) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        return $query;
    }

    /**
     * Custom ordering for posts
     */
    protected function applyOrdering(Builder $query): Builder
    {
        return $query->latest('published_at');
    }

    // Removed: Now using BaseRepository::getFeatured()

    public function getLatest(int $limit = 10)
    {
        return $this->model
            ->published()
            ->with(['user', 'categories'])
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function incrementViews(int $postId): void
    {
        $this->model->where('id', $postId)->increment('views');
    }

    public function incrementLikes(int $postId): void
    {
        $this->model->where('id', $postId)->increment('likes');
    }

    public function decrementLikes(int $postId): void
    {
        $this->model->where('id', $postId)->decrement('likes');
    }
}
