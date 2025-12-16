<?php

declare(strict_types=1);

namespace App\DTOs\Post;

use Illuminate\Http\Request;

final readonly class UpdatePostDTO
{
    public function __construct(
        public ?string $title = null,
        public ?string $slug = null,
        public ?string $content = null,
        public ?string $excerpt = null,
        public ?string $featured_image = null,
        public ?string $status = null,
        public ?string $type = null,
        public ?bool $is_featured = null,
        public ?bool $is_pinned = null,
        /** @var string[]|null */
        public ?array $categories = null,
        public ?\DateTimeInterface $published_at = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title: $request->input('title') ?: null,
            slug: $request->input('slug') ?: null,
            content: $request->input('content') ?: null,
            excerpt: $request->input('excerpt') ?: null,
            featured_image: $request->input('featured_image') ?: null,
            status: $request->input('status') ?: null,
            type: $request->input('type') ?: null,
            is_featured: $request->has('is_featured') ? $request->boolean('is_featured') : null,
            is_pinned: $request->has('is_pinned') ? $request->boolean('is_pinned') : null,
            categories: $request->has('categories') ? $request->input('categories', []) : null,
            published_at: $request->date('published_at') ?: null,
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $data = [
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

        return array_filter($data, fn ($value) => $value !== null);
    }
}
