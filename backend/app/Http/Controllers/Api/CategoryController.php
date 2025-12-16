<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CategoryCollection;
use App\Http\Resources\Api\CategoryResource;
use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class CategoryController extends Controller
{
    public function __construct(
        private CategoryRepository $categoryRepository
    ) {}

    /**
     * List all categories
     */
    public function index(Request $request): JsonResource
    {
        $includeCount = $request->boolean('include_count', false);

        if ($includeCount) {
            $categories = $this->categoryRepository->getWithPostCount();
        } else {
            $categories = $this->categoryRepository->all();
        }

        return new CategoryCollection($categories);
    }

    /**
     * Get single category by slug
     */
    public function show(Request $request, Category $category): JsonResource
    {
        $includePosts = $request->boolean('include_posts', false);

        if ($includePosts) {
            $category->load([
                'posts' => function ($query) {
                    $query->published()
                        ->latest('published_at')
                        ->limit(10);
                },
            ]);
        }

        return new CategoryResource($category);
    }

    /**
     * Get category tree structure
     */
    public function tree(Request $request): JsonResource
    {
        $includeCount = $request->boolean('include_count', false);

        if ($includeCount) {
            $categories = $this->categoryRepository->getRootCategories();
        } else {
            $categories = $this->categoryRepository->getTree();
        }

        return new CategoryCollection($categories);
    }

    /**
     * Get posts by category
     */
    public function posts(Request $request, Category $category): JsonResource
    {
        $perPage = min($request->integer('per_page', 15), 100);
        $page = $request->integer('page', 1);

        $posts = $category->posts()
            ->published()
            ->with(['user', 'categories'])
            ->latest('published_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return (new CategoryResource($category))
            ->additional([
                'included' => collect($posts->items())->map(fn ($post) => new PostResource($post)),
                'meta' => [
                    'total' => $posts->total(),
                    'perPage' => $posts->perPage(),
                    'currentPage' => $posts->currentPage(),
                    'lastPage' => $posts->lastPage(),
                ],
                'links' => [
                    'first' => $posts->url(1),
                    'last' => $posts->url($posts->lastPage()),
                    'prev' => $posts->previousPageUrl(),
                    'next' => $posts->nextPageUrl(),
                ],
            ]);
    }
}
