<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    // Removed: Now using BaseRepository::findBySlug()

    public function getByIds(array $ids): Collection
    {
        return $this->model->whereIn('id', $ids)->get();
    }

    public function getRootCategories(): Collection
    {
        return $this->model
            ->whereNull('parent_id')
            ->withCount('posts')
            ->orderBy('order')
            ->get();
    }

    public function getTree(): Collection
    {
        $categories = $this->getRootCategories();

        return $categories->map(function ($category) {
            $category->children = $this->getChildren($category->id);

            return $category;
        });
    }

    public function getChildren(int $parentId): Collection
    {
        return $this->model
            ->where('parent_id', $parentId)
            ->withCount('posts')
            ->orderBy('order')
            ->get();
    }

    public function getWithPostCount(): Collection
    {
        return $this->model
            ->withCount('posts')
            ->orderBy('order')
            ->get();
    }
}
