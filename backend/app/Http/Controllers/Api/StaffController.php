<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Staff\IndexStaffRequest;
use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Http\Resources\StaffCollection;
use App\Http\Resources\StaffResource;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class StaffController extends BaseApiController
{
    public function __construct(StaffService $service)
    {
        parent::__construct($service);
    }

    protected function getResourceClass(): string
    {
        return StaffResource::class;
    }

    protected function getCollectionClass(): string
    {
        return StaffCollection::class;
    }

    protected function getStoreRequest(): string
    {
        return StoreStaffRequest::class;
    }

    protected function getUpdateRequest(): string
    {
        return UpdateStaffRequest::class;
    }

    protected function getIndexRequest(): string
    {
        return IndexStaffRequest::class;
    }

    // Implement methods with proper type hints for route model binding

    /**
     * Update the specified staff member.
     */
    public function update(UpdateStaffRequest $request, \App\Models\Staff $staff): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $staff);

        $updatedStaff = $this->service->updateStaff($staff, $request->validated());

        return (new StaffResource($updatedStaff))->toResponse($request);
    }

    /**
     * Remove the specified staff member.
     */
    public function destroy(\App\Models\Staff $staff): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $staff);

        $this->service->deleteStaff($staff);

        return response()->json(null, 204);
    }

    /**
     * Toggle featured status of staff member.
     */
    public function toggleFeatured(\App\Models\Staff $staff): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $staff);

        $updatedStaff = $this->service->toggleFeaturedStatus($staff);

        return (new StaffResource($updatedStaff))->toResponse(request());
    }

    /**
     * Toggle active status of staff member.
     */
    public function toggleActive(\App\Models\Staff $staff): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $staff);

        $updatedStaff = $this->service->toggleActiveStatus($staff);

        return (new StaffResource($updatedStaff))->toResponse(request());
    }

    // Domain-specific endpoints below

    /**
     * Display staff members by type.
     */
    public function byType(Request $request, string $type): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|boolean',
        ]);

        $staff = $this->service->getStaffByType(
            type: $type,
            limit: $request->get('limit', 15),
            paginate: $request->boolean('paginate', true)
        );

        return $request->boolean('paginate')
            ? (new StaffCollection($staff))->toResponse($request)
            : response()->json([
                'data' => StaffResource::collection($staff),
                'meta' => [
                    'count' => $staff->count(),
                ],
            ]);
    }

    /**
     * Display staff members by department.
     */
    public function byDepartment(Request $request, string $department): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|boolean',
        ]);

        $staff = $this->service->getStaffByDepartment(
            department: $department,
            limit: $request->get('limit', 15),
            paginate: $request->boolean('paginate', true)
        );

        return $request->boolean('paginate')
            ? (new StaffCollection($staff))->toResponse($request)
            : response()->json([
                'data' => StaffResource::collection($staff),
                'meta' => [
                    'count' => $staff->count(),
                ],
            ]);
    }

    /**
     * Display teachers (staff with type 'teacher').
     */
    public function teachers(Request $request): JsonResponse
    {
        $request->validate([
            'department' => 'nullable|string',
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|boolean',
        ]);

        $staff = $this->service->getTeachers(
            department: $request->get('department'),
            limit: $request->get('limit', 15),
            paginate: $request->boolean('paginate', true)
        );

        return $request->boolean('paginate')
            ? (new StaffCollection($staff))->toResponse($request)
            : response()->json([
                'data' => StaffResource::collection($staff),
                'meta' => [
                    'count' => $staff->count(),
                ],
            ]);
    }

    /**
     * Get staff types.
     */
    public function types(): JsonResponse
    {
        $types = $this->service->getStaffTypes();

        return response()->json([
            'data' => $types,
        ]);
    }

    /**
     * Get departments.
     */
    public function departments(): JsonResponse
    {
        $departments = $this->service->getDepartments();

        return response()->json([
            'data' => $departments,
        ]);
    }
}
