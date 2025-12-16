<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class AnnouncementCollection extends ResourceCollection
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
                'pinned_count' => $this->collection->where('is_pinned', true)->count(),
                'expired_count' => $this->collection->filter(fn ($item) => $item->isExpired())->count(),
                'active_count' => $this->collection->filter(fn ($item) => $item->canBeDisplayed())->count(),
                'types' => $this->getTypesCount(),
                'priorities' => $this->getPrioritiesCount(),
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

        if (str_contains($include, 'category')) {
            $categories = $this->collection
                ->map(fn ($item) => $item->category)
                ->filter()
                ->unique('id');

            $included['categories'] = CategoryResource::collection($categories);
        }

        if (str_contains($include, 'user')) {
            $users = $this->collection
                ->map(fn ($item) => $item->user)
                ->filter()
                ->unique('id');

            $included['users'] = UserResource::collection($users);
        }

        return $included;
    }

    private function getTypesCount(): array
    {
        $types = [
            'info' => 0,
            'event' => 0,
            'warning' => 0,
            'success' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($types[$item->type])) {
                $types[$item->type]++;
            }
        }

        return $types;
    }

    private function getPrioritiesCount(): array
    {
        $priorities = [
            'low' => 0,
            'medium' => 0,
            'high' => 0,
            'urgent' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($priorities[$item->priority])) {
                $priorities[$item->priority]++;
            }
        }

        return $priorities;
    }
}
