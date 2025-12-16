<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class PostCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $isPaginator = $this->resource instanceof \Illuminate\Pagination\LengthAwarePaginator;

        return [
            'data' => $this->collection,
            'included' => $this->getIncludedResources($request),
            'meta' => $isPaginator ? [
                'total' => $this->resource->total(),
                'perPage' => $this->resource->perPage(),
                'currentPage' => $this->resource->currentPage(),
                'lastPage' => $this->resource->lastPage(),
                'from' => $this->resource->firstItem(),
                'to' => $this->resource->lastItem(),
            ] : [
                'total' => $this->collection->count(),
            ],
            'links' => $isPaginator ? [
                'first' => $this->resource->url(1),
                'last' => $this->resource->url($this->resource->lastPage()),
                'prev' => $this->resource->previousPageUrl(),
                'next' => $this->resource->nextPageUrl(),
            ] : null,
        ];
    }

    /**
     * Get included resources for JSON:API compatibility
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<int, JsonResource>
     */
    private function getIncludedResources($request): array
    {
        $included = [];

        // Include authors (using 'user' relationship)
        $authors = $this->collection->map(fn ($post) => $post->whenLoaded('user'))
            ->filter(fn ($user) => $user !== null && $user !== false)
            ->unique('id')
            ->values();

        foreach ($authors as $author) {
            $included[] = new UserResource($author);
        }

        // Include categories
        $categories = $this->collection->flatMap(fn ($post) => $post->whenLoaded('categories', fn () => $post->categories, []))
            ->filter(fn ($cat) => $cat !== null && $cat !== false)
            ->unique('id')
            ->values();

        foreach ($categories as $category) {
            $included[] = new CategoryResource($category);
        }

        return $included;
    }
}
