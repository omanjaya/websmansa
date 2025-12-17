<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $shouldShowFullContent = $this->shouldShowFullContent($request);
        $user = $request->user();

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'type' => $this->type,
            'attributes' => [
                'title' => $this->title,
                'slug' => $this->slug,
                'excerpt' => $this->excerpt,
                'content' => $this->when($shouldShowFullContent, $this->content),
                'featured_image' => $this->featured_image_url,
                'status' => $this->status,
                'type' => $this->type,
                'views' => (int) $this->views,
                'likes' => (int) $this->likes,
                'is_featured' => (bool) $this->is_featured,
                'is_pinned' => (bool) $this->is_pinned,
                'published_at' => $this->published_at?->toIso8601String(),
                'created_at' => $this->created_at->toIso8601String(),
                'updated_at' => $this->updated_at->toIso8601String(),
            ],
            'relationships' => [
                'author' => $this->when($this->whenLoaded('user'), fn () => [
                    'id' => $this->user->id,
                    'type' => 'user',
                    'attributes' => [
                        'name' => $this->user->name,
                        'avatar' => $this->user->avatar
                            ? asset("storage/{$this->user->avatar}")
                            : null,
                        'email' => $this->when($shouldShowFullContent, $this->user->email),
                    ],
                ]),
                'categories' => $this->when($this->whenLoaded('categories'), fn () => collect($this->categories)->map(fn ($cat) => [
                    'id' => $cat->id,
                    'type' => 'category',
                    'attributes' => [
                        'name' => $cat->name,
                        'slug' => $cat->slug,
                    ],
                ])
                ),
            ],
            'meta' => [
                'excerpt_length' => strlen($this->excerpt ?? ''),
                'reading_time' => $this->calculateReadingTime($this->content ?? ''),
                'is_liked' => $this->when($user, fn () => $this->isLikedBy($user)
                ),
            ],
        ];
    }

    /**
     * Determine if full content should be shown
     */
    private function shouldShowFullContent(Request $request): bool
    {
        return $request->routeIs('api.posts.show') ||
               $request->routeIs('api.admin.posts.show');
    }

    /**
     * Calculate estimated reading time in minutes
     */
    private function calculateReadingTime(string $content): int
    {
        if (empty($content)) {
            return 0;
        }

        // Strip HTML tags and count words
        $wordCount = str_word_count(strip_tags($content));

        // Average reading speed: 200 words per minute
        return (int) max(1, ceil($wordCount / 200));
    }

    /**
     * Check if post is liked by user
     */
    private function isLikedBy($user): bool
    {
        if (! $this->relationLoaded('postLikes') || ! $user) {
            return false;
        }

        return $this->postLikes->contains('user_id', $user->id);
    }
}
