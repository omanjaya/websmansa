<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class StaffCollection extends ResourceCollection
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
                'with_photo_count' => $this->collection->filter(fn ($item) => $item->hasPhoto())->count(),
                'with_contact_count' => $this->collection->filter(fn ($item) => $item->hasContactInfo())->count(),
                'types' => $this->getTypesCount(),
                'departments' => $this->getDepartmentsCount(),
                'total_experience' => $this->collection->sum('experience'),
                'average_experience' => $this->collection->avg('experience'),
                'most_experienced' => $this->getMostExperiencedStaff(),
                'departments_by_count' => $this->getDepartmentsByCount(),
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

    private function getTypesCount(): array
    {
        $types = [
            'teacher' => 0,
            'admin' => 0,
            'staff' => 0,
            'headmaster' => 0,
            'vice_headmaster' => 0,
            'counselor' => 0,
            'librarian' => 0,
            'lab_assistant' => 0,
            'security' => 0,
            'cleaner' => 0,
            'cafeteria' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($types[$item->type])) {
                $types[$item->type]++;
            }
        }

        return $types;
    }

    private function getDepartmentsCount(): array
    {
        $departments = [
            'mathematics' => 0,
            'indonesian' => 0,
            'english' => 0,
            'physics' => 0,
            'chemistry' => 0,
            'biology' => 0,
            'history' => 0,
            'geography' => 0,
            'economics' => 0,
            'sociology' => 0,
            'civics' => 0,
            'religion' => 0,
            'art' => 0,
            'music' => 0,
            'pe' => 0,
            'it' => 0,
            'counseling' => 0,
            'library' => 0,
            'laboratory' => 0,
            'administration' => 0,
            'finance' => 0,
            'student_affairs' => 0,
            'curriculum' => 0,
            'facilities' => 0,
            'public_relation' => 0,
            'security' => 0,
            'cleaning' => 0,
            'cafeteria' => 0,
            'health' => 0,
        ];

        foreach ($this->collection as $item) {
            if (isset($departments[$item->department])) {
                $departments[$item->department]++;
            }
        }

        return $departments;
    }

    private function getMostExperiencedStaff(): array
    {
        return $this->collection
            ->sortByDesc('experience')
            ->take(5)
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'type' => $item->type,
                    'type_label' => $item->getTypeLabel(),
                    'department' => $item->department,
                    'department_label' => $item->getDepartmentLabel(),
                    'experience' => $item->experience,
                    'experience_formatted' => $item->getExperienceFormatted(),
                    'position' => $item->position,
                    'photo_url' => $item->getPhotoUrl(),
                ];
            })
            ->values()
            ->toArray();
    }

    private function getDepartmentsByCount(): array
    {
        $departments = [];

        foreach ($this->collection as $item) {
            $department = $item->department;

            if (! $department) {
                continue;
            }

            if (! isset($departments[$department])) {
                $departments[$department] = [
                    'department' => $department,
                    'label' => $item->getDepartmentLabel(),
                    'count' => 0,
                    'total_experience' => 0,
                    'avg_experience' => 0,
                ];
            }

            $departments[$department]['count']++;
            $departments[$department]['total_experience'] += $item->experience ?? 0;
        }

        // Calculate average experience
        foreach ($departments as $key => $value) {
            if ($value['count'] > 0) {
                $departments[$key]['avg_experience'] = round($value['total_experience'] / $value['count'], 1);
            }
        }

        // Sort by count
        uasort($departments, function ($a, $b) {
            return $b['count'] - $a['count'];
        });

        return array_values(array_slice($departments, 0, 10, true));
    }
}
