<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DTOs\Post\CreatePostDTO;
use App\DTOs\Post\UpdatePostDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Post\IndexPostRequest;
use App\Http\Requests\Api\Post\ShowPostRequest;
use App\Http\Requests\Api\Post\StorePostRequest;
use App\Http\Requests\Api\Post\UpdatePostRequest;
use App\Http\Resources\Api\PostCollection;
use App\Http\Resources\Api\PostResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * List posts with filtering and pagination
     */
    public function index(IndexPostRequest $request): JsonResource
    {
        $posts = $this->postService->getPosts($request->validated());

        return new PostCollection($posts);
    }

    /**
     * Store a new post
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        $dto = CreatePostDTO::fromRequest($request);
        $post = $this->postService->createPost($dto, $request->file('featured_image'));

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Get single post by slug
     */
    public function show(ShowPostRequest $request, string $slug): JsonResource
    {
        $post = $this->postService->getPostBySlug($slug);

        if (! $post) {
            abort(404);
        }

        // Increment view count
        $this->postService->incrementViews($post);

        // Load relationships for detail view
        $post->load(['user', 'categories']);

        return new PostResource($post);
    }

    /**
     * Update post
     */
    public function update(UpdatePostRequest $request, string $slug): JsonResource
    {
        $post = $this->postService->getPostBySlug($slug);

        if (! $post) {
            abort(404);
        }

        $this->authorize('update', $post);

        $dto = UpdatePostDTO::fromRequest($request);
        $updatedPost = $this->postService->updatePost($post, $dto);

        return new PostResource($updatedPost);
    }

    /**
     * Delete post
     */
    public function destroy(Request $request, string $slug): JsonResponse
    {
        $post = $this->postService->getPostBySlug($slug);

        if (! $post) {
            abort(404);
        }

        $this->authorize('delete', $post);

        $this->postService->deletePost($post);

        return response()->json(null, 204);
    }

    /**
     * Like a post
     */
    public function like(Request $request, string $slug): JsonResponse
    {
        $post = $this->postService->getPostBySlug($slug);

        if (! $post) {
            abort(404);
        }

        $user = $request->user();
        $isLiked = $user->likes()->where('post_id', $post->id)->exists();

        if (! $isLiked) {
            $user->likes()->attach($post->id);
            $this->postService->incrementLikes($post->id);
            $isLiked = true;
            $likes = $post->likes + 1;
        } else {
            $user->likes()->detach($post->id);
            $this->postService->decrementLikes($post->id);
            $isLiked = false;
            $likes = max(0, $post->likes - 1);
        }

        return response()->json([
            'data' => [
                'likes' => $likes,
                'isLiked' => $isLiked,
            ],
        ]);
    }

    /**
     * Increment view count (for API clients)
     */
    public function view(Request $request, string $slug): JsonResponse
    {
        $post = $this->postService->getPostBySlug($slug);

        if (! $post) {
            abort(404);
        }

        $this->postService->incrementViews($post);

        return response()->json(null, 204);
    }

    /**
     * Get featured posts
     */
    public function featured(Request $request): JsonResource
    {
        $limit = min($request->integer('limit', 6), 20);
        $posts = $this->postService->getFeaturedPosts($limit);

        return new PostCollection(collect($posts));
    }

    /**
     * Get latest posts
     */
    public function latest(Request $request): JsonResource
    {
        $limit = min($request->integer('limit', 10), 30);
        $posts = $this->postService->getLatestPosts($limit);

        return new PostCollection(collect($posts));
    }
}
