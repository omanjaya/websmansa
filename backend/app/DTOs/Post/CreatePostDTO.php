<?php

declare(strict_types=1);

namespace App\DTOs\Post;

use Illuminate\Http\Request;

final readonly class CreatePostDTO
{
    public function __construct(
        public string $title,
        public string $slug,
        public string $content,
        public ?string $excerpt = null,
        public ?string $featured_image = null,
        public string $status = 'draft',
        public string $type = 'post',
        public bool $is_featured = false,
        public bool $is_pinned = false,
        /** @var string[] */
        public array $categories = [],
        public ?\DateTimeInterface $published_at = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->input('title', ''),
            slug: $request->input('slug', ''),
            content: $request->input('content', ''),
            excerpt: $request->input('excerpt') ?: null,
            featured_image: $request->input('featured_image') ?: null,
            status: $request->input('status', 'draft'),
            type: $request->input('type', 'post'),
            is_featured: $request->boolean('is_featured', false),
            is_pinned: $request->boolean('is_pinned', false),
            categories: $request->input('categories', []),
            published_at: $request->date('published_at') ?: null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'featured_image' => $this->featured_image,
            'status' => $this->status,
            'type' => $this->type,
            'is_featured' => $this->is_featured,
            'is_pinned' => $this->is_pinned,
            'categories' => $this->categories,
            'published_at' => $this->published_at,
        ];
    }
}
