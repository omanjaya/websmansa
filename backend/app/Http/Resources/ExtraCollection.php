<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class ExtraCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'included' => $this->when(
                $request->get('include'),
                $this->getIncludedResources($request)
            ),
            'meta' => [
                'count' => $this->collection->count(),
                'featured_count' => $this->collection->where('is_featured', true)->count(),
                'active_count' => $this->collection->where('is_active', true)->count(),
                'categories' => $this->getCategoriesCount(),
                'total_members' => $this->collection->sum(fn ($item) => $item->members_count ?? 0),
                'total_capacity' => $this->collection->sum('capacity'),
                'popular_categories' => $this->getPopularCategories(),
            ],
            'links' => $this->when(
                method_exists($this->resource, 'links'),
                $this->resource->toArray($request)['links'] ?? []
            ),
        ];
    }

    private function getIncludedResources(Request $request): array
    {
        $include = $request->get('include', '');
        $included = [];

        if (str_contains($include, 'user')) {
            $users = $this->collection
                ->map(fn ($item) => $item->user)
                ->filter()
                ->unique('id');

            $included['users'] = UserResource::collection($users);
        }

        return $included;
    }

    private function getCategoriesCount(): array
    {
        $categories = [
            'sports' => 0,
            'arts' => 0,
            'academic' => 0,
            'social' => 0,
            'technology' => 0,
            'language' => 0,
            'leadership' => 0,
            'volunteer' => 0,
            'religious' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($categories[$item->category])) {
                $categories[$item->category]++;
            }
        }

        return $categories;
    }

    private function getPopularCategories(): array
    {
        $categories = [];

        foreach ($this->collection as $item) {
            $category = $item->category;
            $memberCount = $item->members_count ?? 0;

            if (! isset($categories[$category])) {
                $categories[$category] = [
                    'category' => $category,
                    'label' => $item->getCategoryLabel(),
                    'count' => 0,
                    'members' => 0,
                ];
            }

            $categories[$category]['count']++;
            $categories[$category]['members'] += $memberCount;
        }

        // Sort by total members, then by count
        uasort($categories, function ($a, $b) {
            if ($a['members'] === $b['members']) {
                return $b['count'] - $a['count'];
            }

            return $b['members'] - $a['members'];
        });

        return array_values(array_slice($categories, 0, 5, true));
    }
}
