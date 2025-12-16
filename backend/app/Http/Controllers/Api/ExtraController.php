<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Extra\IndexExtraRequest;
use App\Http\Requests\Extra\ShowExtraRequest;
use App\Http\Requests\Extra\StoreExtraRequest;
use App\Http\Requests\Extra\UpdateExtraRequest;
use App\Http\Resources\ExtraCollection;
use App\Http\Resources\ExtraResource;
use App\Services\ExtraService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ExtraController extends BaseApiController
{
    public function __construct(ExtraService $service)
    {
        parent::__construct($service);
    }

    protected function getResourceClass(): string
    {
        return ExtraResource::class;
    }

    protected function getCollectionClass(): string
    {
        return ExtraCollection::class;
    }

    protected function getStoreRequest(): string
    {
        return StoreExtraRequest::class;
    }

    protected function getUpdateRequest(): string
    {
        return UpdateExtraRequest::class;
    }

    protected function getIndexRequest(): string
    {
        return IndexExtraRequest::class;
    }

    // Implement methods with proper type hints for route model binding

    /**
     * Update the specified extracurricular activity.
     */
    public function update(UpdateExtraRequest $request, \App\Models\Extra $extra): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $extra);

        $updatedExtra = $this->service->updateExtra($extra, $request->validated());

        return (new ExtraResource($updatedExtra))->toResponse($request);
    }

    /**
     * Remove the specified extracurricular activity.
     */
    public function destroy(\App\Models\Extra $extra): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $extra);

        $this->service->deleteExtra($extra);

        return response()->json(null, 204);
    }

    /**
     * Toggle featured status of extracurricular activity.
     */
    public function toggleFeatured(\App\Models\Extra $extra): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $extra);

        $updatedExtra = $this->service->toggleFeaturedStatus($extra);

        return (new ExtraResource($updatedExtra))->toResponse(request());
    }

    /**
     * Toggle active status of extracurricular activity.
     */
    public function toggleActive(\App\Models\Extra $extra): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $extra);

        $updatedExtra = $this->service->toggleActiveStatus($extra);

        return (new ExtraResource($updatedExtra))->toResponse(request());
    }

    // Domain-specific endpoints below

    /**
     * Display extracurricular activities by category.
     */
    public function byCategory(Request $request, string $category): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|in:0,1,true,false',
        ]);

        $limit = (int) ($validated['limit'] ?? 15);
        $paginate = isset($validated['paginate']) ? (bool) $validated['paginate'] : true;

        $extras = $this->service->getExtrasByCategory(
            category: $category,
            limit: $limit,
            paginate: $paginate
        );

        return $paginate
            ? (new ExtraCollection($extras))->toResponse($request)
            : response()->json([
                'data' => ExtraResource::collection($extras),
                'meta' => [
                    'count' => $extras->count(),
                ],
            ]);
    }

    /**
     * Join extracurricular activity.
     */
    public function join(\App\Models\Extra $extra): JsonResponse
    {
        $user = auth()->user();

        $result = $this->service->joinExtra($extra, $user);

        return response()->json([
            'message' => $result['message'],
            'data' => new ExtraResource($result['extra']),
        ]);
    }

    /**
     * Leave extracurricular activity.
     */
    public function leave(\App\Models\Extra $extra): JsonResponse
    {
        $user = auth()->user();

        $result = $this->service->leaveExtra($extra, $user);

        return response()->json([
            'message' => $result['message'],
            'data' => new ExtraResource($result['extra']),
        ]);
    }

    /**
     * Get members of extracurricular activity.
     */
    public function members(Request $request, \App\Models\Extra $extra): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:100',
            'role' => 'nullable|string|in:member,leader,assistant',
        ]);

        $members = $this->service->getExtraMembers(
            extra: $extra,
            role: $request->get('role'),
            limit: $request->get('limit', 50)
        );

        return response()->json([
            'data' => $members->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'avatar' => $member->avatar,
                    'role' => $member->pivot->role,
                    'joined_at' => $member->pivot->joined_at,
                ];
            }),
            'meta' => [
                'count' => $members->count(),
            ],
        ]);
    }
}
