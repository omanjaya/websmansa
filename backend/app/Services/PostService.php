<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\Post\CreatePostDTO;
use App\DTOs\Post\UpdatePostDTO;
use App\Models\Post;
use App\Repositories\CategoryRepository;
use App\Repositories\PostRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class PostService
{
    public function __construct(
        private PostRepository $postRepository,
        private CategoryRepository $categoryRepository,
        private ImageService $imageService,
        private CacheService $cacheService,
    ) {}

    public function getPosts(array $filters = [])
    {
        $cacheKey = 'posts.'.md5(serialize($filters));

        // Extract pagination parameters
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;
        $paginate = $filters['paginate'] ?? true;

        // Remove pagination params from filters before passing to repository
        $filtersCopy = $filters;
        unset($filtersCopy['per_page'], $filtersCopy['paginate'], $filtersCopy['page']);

        return Cache::remember(
            $cacheKey,
            now()->addMinutes(15),
            fn () => $this->postRepository->getFiltered(
                filters: $filtersCopy,
                relations: $filters['include'] ?? [],
                perPage: $perPage,
                paginate: $paginate
            )
        );
    }

    public function getPostBySlug(string $slug): ?Post
    {
        $cacheKey = "post.{$slug}";

        return Cache::remember(
            $cacheKey,
            now()->addMinutes(30),
            fn () => $this->postRepository->findBySlug($slug)
        );
    }

    public function createPost(CreatePostDTO $dto): Post
    {
        return DB::transaction(function () use ($dto) {
            // Generate slug if not provided
            if (empty($dto->slug)) {
                $dto = new CreatePostDTO(
                    title: $dto->title,
                    slug: Str::slug($dto->title),
                    content: $dto->content,
                    excerpt: $dto->excerpt,
                    featured_image: $dto->featured_image,
                    status: $dto->status,
                    type: $dto->type,
                    is_featured: $dto->is_featured,
                    is_pinned: $dto->is_pinned,
                    categories: $dto->categories,
                    published_at: $dto->published_at,
                );
            }

            // Handle featured image upload
            if ($dto->featured_image && str_starts_with($dto->featured_image, 'data:image')) {
                $dto = new CreatePostDTO(
                    title: $dto->title,
                    slug: $dto->slug,
                    content: $dto->content,
                    excerpt: $dto->excerpt,
                    featured_image: $this->imageService->uploadBase64($dto->featured_image, 'posts'),
                    status: $dto->status,
                    type: $dto->type,
                    is_featured: $dto->is_featured,
                    is_pinned: $dto->is_pinned,
                    categories: $dto->categories,
                    published_at: $dto->published_at,
                );
            }

            $data = $dto->toArray();
            $data['user_id'] = auth()->id();

            $post = $this->postRepository->create($data);

            // Attach categories
            if (! empty($dto->categories)) {
                $categories = $this->categoryRepository->getByIds($dto->categories);
                $post->categories()->attach($categories);
            }

            // Clear only affected cache keys
            $this->clearPostCache($post);

            return $post;
        });
    }

    public function updatePost(Post $post, UpdatePostDTO $dto): Post
    {
        return DB::transaction(function () use ($post, $dto) {
            $data = $dto->toArray();

            // Handle featured image update
            if (isset($data['featured_image']) && str_starts_with($data['featured_image'], 'data:image')) {
                $data['featured_image'] = $this->imageService->uploadBase64($data['featured_image'], 'posts');
            }

            $post->update($data);

            // Update categories if provided
            if ($dto->categories !== null) {
                $post->categories()->sync($dto->categories);
            }

            // Clear only affected cache keys
            $this->clearPostCache($post);

            return $post->fresh();
        });
    }

    public function deletePost(Post $post): bool
    {
        return DB::transaction(function () use ($post) {
            // Clear cache before deleting
            $this->clearPostCache($post);

            $result = $this->postRepository->delete($post->id);

            return $result;
        });
    }

    public function incrementViews(Post $post): void
    {
        $this->postRepository->incrementViews($post->id);

        // Update cache with fresh data
        $post->refresh();
        Cache::put("post.{$post->slug}", $post, now()->addMinutes(30));
    }

    public function incrementLikes(int $postId): void
    {
        $this->postRepository->incrementLikes($postId);
    }

    public function decrementLikes(int $postId): void
    {
        $this->postRepository->decrementLikes($postId);
    }

    public function getFeaturedPosts(int $limit = 6)
    {
        return Cache::remember(
            "featured.posts.{$limit}",
            now()->addMinutes(30),
            fn () => $this->postRepository->getFeatured($limit)
        );
    }

    public function getLatestPosts(int $limit = 10)
    {
        return Cache::remember(
            "latest.posts.{$limit}",
            now()->addMinutes(15),
            fn () => $this->postRepository->getLatest($limit)
        );
    }

    /**
     * Selectively clear cache for a specific post
     * More efficient than flushing all post cache
     */
    private function clearPostCache(Post $post): void
    {
        // Clear specific post cache
        Cache::forget("post.{$post->slug}");

        // Clear list caches that might include this post
        Cache::forget('posts.featured');
        Cache::forget('posts.latest');

        // Clear paginated lists (limit to first few pages)
        for ($page = 1; $page <= 5; $page++) {
            Cache::forget("posts.page.{$page}");
        }

        // Note: We don't flush the entire tag, preserving other cached data
    }
}
