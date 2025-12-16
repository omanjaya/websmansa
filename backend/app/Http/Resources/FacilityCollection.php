<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class FacilityCollection extends ResourceCollection
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
                'bookable_count' => $this->collection->filter(fn ($item) => $item->canBeBooked())->count(),
                'categories' => $this->getCategoriesCount(),
                'total_capacity' => $this->collection->sum('capacity'),
                'total_area' => $this->collection->sum('area'),
                'categories_by_area' => $this->getCategoriesByArea(),
                'largest_facilities' => $this->getLargestFacilities(),
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
            'classroom' => 0,
            'laboratory' => 0,
            'library' => 0,
            'sports' => 0,
            'canteen' => 0,
            'health' => 0,
            'auditorium' => 0,
            'multipurpose' => 0,
            'parking' => 0,
            'worship' => 0,
            'toilet' => 0,
            'garden' => 0,
            'computer' => 0,
            'science' => 0,
            'language' => 0,
            'art' => 0,
            'music' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($categories[$item->category])) {
                $categories[$item->category]++;
            }
        }

        return $categories;
    }

    private function getCategoriesByArea(): array
    {
        $categories = [];

        foreach ($this->collection as $item) {
            $category = $item->category;
            $area = $item->area ?? 0;

            if (! isset($categories[$category])) {
                $categories[$category] = [
                    'category' => $category,
                    'label' => $item->getCategoryLabel(),
                    'count' => 0,
                    'total_area' => 0,
                    'avg_area' => 0,
                ];
            }

            $categories[$category]['count']++;
            $categories[$category]['total_area'] += $area;
        }

        // Calculate average area
        foreach ($categories as $key => $value) {
            if ($value['count'] > 0) {
                $categories[$key]['avg_area'] = round($value['total_area'] / $value['count']);
            }
        }

        // Sort by total area
        uasort($categories, function ($a, $b) {
            return $b['total_area'] - $a['total_area'];
        });

        return array_values(array_slice($categories, 0, 5, true));
    }

    private function getLargestFacilities(): array
    {
        return $this->collection
            ->sortByDesc('area')
            ->take(5)
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'category' => $item->category,
                    'category_label' => $item->getCategoryLabel(),
                    'area' => $item->area,
                    'area_formatted' => $item->getAreaFormatted(),
                    'capacity' => $item->capacity,
                    'capacity_label' => $item->getCapacityFormatted(),
                ];
            })
            ->values()
            ->toArray();
    }
}
