<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Requests\Announcement\IndexAnnouncementRequest;
use App\Http\Requests\Announcement\ShowAnnouncementRequest;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use App\Http\Resources\AnnouncementCollection;
use App\Http\Resources\AnnouncementResource;
use App\Services\AnnouncementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AnnouncementController extends BaseApiController
{
    public function __construct(AnnouncementService $service)
    {
        parent::__construct($service);
    }

    protected function getResourceClass(): string
    {
        return AnnouncementResource::class;
    }

    protected function getCollectionClass(): string
    {
        return AnnouncementCollection::class;
    }

    protected function getStoreRequest(): string
    {
        return StoreAnnouncementRequest::class;
    }

    protected function getUpdateRequest(): string
    {
        return UpdateAnnouncementRequest::class;
    }

    protected function getIndexRequest(): string
    {
        return IndexAnnouncementRequest::class;
    }

    // Implement methods with proper type hints for route model binding

    /**
     * Update the specified announcement.
     */
    public function update(UpdateAnnouncementRequest $request, \App\Models\Announcement $announcement): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $announcement);

        $updatedAnnouncement = $this->service->updateAnnouncement($announcement, $request->validated());

        return (new AnnouncementResource($updatedAnnouncement))->toResponse($request);
    }

    /**
     * Remove the specified announcement.
     */
    public function destroy(\App\Models\Announcement $announcement): \Illuminate\Http\JsonResponse
    {
        $this->authorize('delete', $announcement);

        $this->service->deleteAnnouncement($announcement);

        return response()->json(null, 204);
    }

    /**
     * Toggle pinned status of announcement.
     */
    public function togglePin(\App\Models\Announcement $announcement): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $announcement);

        $updatedAnnouncement = $this->service->togglePinStatus($announcement);

        return (new AnnouncementResource($updatedAnnouncement))->toResponse(request());
    }

    /**
     * Toggle active status of announcement.
     */
    public function toggleActive(\App\Models\Announcement $announcement): \Illuminate\Http\JsonResponse
    {
        $this->authorize('update', $announcement);

        $updatedAnnouncement = $this->service->toggleActiveStatus($announcement);

        return (new AnnouncementResource($updatedAnnouncement))->toResponse(request());
    }

    // Domain-specific endpoints below

    /**
     * Display featured announcements.
     * Overrides base to use default limit of 5 instead of 6.
     */
    public function featured(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:20',
        ]);

        $entities = $this->service->getFeatured(
            limit: (int) $request->get('limit', 5)
        );

        return response()->json([
            'data' => AnnouncementResource::collection($entities),
            'meta' => [
                'count' => $entities->count(),
            ],
        ]);
    }

    /**
     * Display latest announcements.
     */
    public function latest(Request $request): JsonResponse
    {
        $announcements = $this->service->getLatestAnnouncements(
            limit: (int) $request->get('limit', 10)
        );

        return response()->json([
            'data' => AnnouncementResource::collection($announcements),
            'meta' => [
                'count' => $announcements->count(),
            ],
        ]);
    }

    /**
     * Display active announcements by type.
     */
    public function byType(Request $request, string $type): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:50',
            'paginate' => 'nullable|in:0,1,true,false',
        ]);

        $limit = (int) ($validated['limit'] ?? 15);
        $paginate = isset($validated['paginate']) ? (bool) $validated['paginate'] : true;

        $announcements = $this->service->getAnnouncementsByType(
            type: $type,
            limit: $limit,
            paginate: $paginate
        );

        return $paginate
            ? (new AnnouncementCollection($announcements))->toResponse($request)
            : response()->json([
                'data' => AnnouncementResource::collection($announcements),
                'meta' => [
                    'count' => $announcements->count(),
                ],
            ]);
    }
}
