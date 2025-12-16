<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Facility\IndexFacilityRequest;
use App\Http\Requests\Facility\StoreFacilityRequest;
use App\Http\Requests\Facility\UpdateFacilityRequest;
use App\Http\Resources\FacilityCollection;
use App\Http\Resources\FacilityResource;
use App\Services\FacilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class FacilityController extends BaseApiController
{
    public function __construct(FacilityService $service)
    {
        parent::__construct($service);
    }

    protected function getResourceClass(): string
    {
        return FacilityResource::class;
    }

    protected function getCollectionClass(): string
    {
        return FacilityCollection::class;
    }

    protected function getStoreRequest(): string
    {
        return StoreFacilityRequest::class;
    }

    protected function getUpdateRequest(): string
    {
        return UpdateFacilityRequest::class;
    }

    protected function getIndexRequest(): string
    {
        return IndexFacilityRequest::class;
    }

    // Implement methods with proper type hints for route model binding

    /**
     * Update the specified facility.
     */
    public function update(UpdateFacilityRequest $request, \App\Models\Facility $facility): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $facility);

        $updatedFacility = $this->service->updateFacility($facility, $request->validated());

        return (new FacilityResource($updatedFacility))->toResponse($request);
    }

    /**
     * Remove the specified facility.
     */
    public function destroy(\App\Models\Facility $facility): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $facility);

        $this->service->deleteFacility($facility);

        return response()->json(null, 204);
    }

    /**
     * Toggle featured status of facility.
     */
    public function toggleFeatured(\App\Models\Facility $facility): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $facility);

        $updatedFacility = $this->service->toggleFeaturedStatus($facility);

        return (new FacilityResource($updatedFacility))->toResponse(request());
    }

    /**
     * Toggle active status of facility.
     */
    public function toggleActive(\App\Models\Facility $facility): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $facility);

        $updatedFacility = $this->service->toggleActiveStatus($facility);

        return (new FacilityResource($updatedFacility))->toResponse(request());
    }

    // Domain-specific endpoints below

    /**
     * Display facilities by category.
     */
    public function byCategory(Request $request, string $category): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|in:0,1,true,false',
        ]);

        $limit = (int) ($validated['limit'] ?? 15);
        $paginate = isset($validated['paginate']) ? (bool) $validated['paginate'] : true;

        $facilities = $this->service->getFacilitiesByCategory(
            category: $category,
            limit: $limit,
            paginate: $paginate
        );

        return $paginate
            ? (new FacilityCollection($facilities))->toResponse($request)
            : response()->json([
                'data' => FacilityResource::collection($facilities),
                'meta' => [
                    'count' => $facilities->count(),
                ],
            ]);
    }

    /**
     * Display facilities that can be booked.
     */
    public function bookable(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|in:0,1,true,false',
        ]);

        $limit = (int) ($validated['limit'] ?? 15);
        $paginate = isset($validated['paginate']) ? (bool) $validated['paginate'] : true;

        $facilities = $this->service->getBookableFacilities(
            limit: $limit,
            paginate: $paginate
        );

        return $paginate
            ? (new FacilityCollection($facilities))->toResponse($request)
            : response()->json([
                'data' => FacilityResource::collection($facilities),
                'meta' => [
                    'count' => $facilities->count(),
                ],
            ]);
    }

    /**
     * Get facility categories.
     */
    public function categories(): JsonResponse
    {
        $categories = $this->service->getFacilityCategories();

        return response()->json([
            'data' => $categories,
        ]);
    }
}
