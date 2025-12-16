<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;

final class CategoryResource extends JsonResource
{
    /**
     * Transform resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => 'category',
            'attributes' => [
                'name' => $this->name,
                'slug' => $this->slug,
                'description' => $this->description,
                'parent_id' => $this->parent_id,
                'order' => (int) $this->order,
                'created_at' => $this->created_at?->toIso8601String(),
                'updated_at' => $this->updated_at?->toIso8601String(),
                'posts_count' => $this->when(
                    $this->relationLoaded('posts_count'),
                    (int) $this->posts_count
                ),
            ],
            'relationships' => [
                'parent' => $this->when($this->parent_id && $this->whenLoaded('parent'), fn () => new self($this->parent)
                ),
                'children' => $this->when($this->whenLoaded('children'), fn () => self::collection($this->children)
                ),
                'posts' => $this->when($this->whenLoaded('posts'), fn () => PostResource::collection($this->posts)
                ),
            ],
            'meta' => [
                'has_children' => $this->when($this->relationLoaded('children'), fn () => $this->children->isNotEmpty()
                ),
                'is_active' => $this->when($this->relationLoaded('posts'), fn () => $this->posts_count > 0
                ),
                'level' => $this->calculateLevel($this),
            ],
        ];
    }

    /**
     * Calculate category level in hierarchy
     */
    private function calculateLevel($category): int
    {
        $level = 0;
        $current = $category;

        while ($current->parent_id !== null) {
            $level++;
            $current = $current->parent ?? $current;
        }

        return $level;
    }
}
