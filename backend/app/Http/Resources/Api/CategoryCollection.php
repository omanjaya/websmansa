<?php

declare(strict_types=1);

namespace App\Http\Resources\Api;

use Illuminate\Http\Resources\Json\ResourceCollection;

final class CategoryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->collection->count(),
                'tree' => $this->when(
                    $request->boolean('as_tree', false),
                    $this->buildTree($this->collection)
                ),
            ],
        ];
    }

    /**
     * Build hierarchical tree structure
     */
    private function buildTree($categories): array
    {
        $root = [];
        $children = [];

        // Separate root and children
        foreach ($categories as $category) {
            if ($category->parent_id === null) {
                $root[] = $category;
            } else {
                $children[$category->parent_id][] = $category;
            }
        }

        // Build tree recursively
        foreach ($root as &$category) {
            $category->children = $this->getChildren($category->id, $children);
        }

        return $root;
    }

    /**
     * Get children by parent ID
     */
    private function getChildren(int $parentId, array $children): array
    {
        if (! isset($children[$parentId])) {
            return [];
        }

        $result = [];
        foreach ($children[$parentId] as &$child) {
            $child->children = $this->getChildren($child->id, $children);
            $result[] = $child;
        }

        return $result;
    }
}
