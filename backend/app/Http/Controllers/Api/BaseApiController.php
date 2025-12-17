<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BaseModelService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Cache;

abstract class BaseApiController extends Controller
{
    protected $service;

    // Abstract methods - must be implemented by child controllers
    abstract protected function getResourceClass(): string;
    abstract protected function getCollectionClass(): string;
    abstract protected function getStoreRequest(): string;
    abstract protected function getUpdateRequest(): string;
    abstract protected function getIndexRequest(): string;

    public function __construct($service)
    {
        $this->service = $service;
    }

    /**
     * Get cache key for this controller
     */
    protected function getCacheKey(Request $request): string
    {
        $class = class_basename(static::class);
        $params = $request->query();
        ksort($params);
        return $class . '_' . md5(json_encode($params));
    }

    /**
     * Get cache TTL in seconds (default 5 minutes)
     */
    protected function getCacheTTL(): int
    {
        return 300; // 5 minutes
    }

    /**
     * Display a listing of resources
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = $this->getCacheKey($request);

        // Try to get from cache first
        $cachedResponse = Cache::get($cacheKey);
        if ($cachedResponse) {
            return response()->json($cachedResponse);
        }

        $requestClass = $this->getIndexRequest();
        $validated = app($requestClass)->validated();

        $paginate = isset($validated['paginate']) ? filter_var($validated['paginate'], FILTER_VALIDATE_BOOLEAN) : true;

        $entities = $this->service->getFiltered(
            filters: $validated,
            limit: (int) ($validated['limit'] ?? 15),
            paginate: $paginate
        );

        $shouldPaginate = $paginate;
        $collectionClass = $this->getCollectionClass();
        $resourceClass = $this->getResourceClass();

        if ($shouldPaginate) {
            $response = (new $collectionClass($entities))->toResponse($request);
            $responseData = json_decode($response->getContent(), true);
            Cache::put($cacheKey, $responseData, $this->getCacheTTL());
            return $response;
        }

        $responseData = [
            'data' => $resourceClass::collection($entities),
            'meta' => [
                'count' => $entities->count(),
            ],
        ];
        Cache::put($cacheKey, $responseData, $this->getCacheTTL());
        return response()->json($responseData);
    }

    /**
     * Display featured resources
     */
    public function featured(Request $request): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:20',
        ]);

        $entities = $this->service->getFeatured(
            limit: (int) $request->get('limit', 6)
        );

        $resourceClass = $this->getResourceClass();

        return response()->json([
            'data' => $resourceClass::collection($entities),
            'meta' => [
                'count' => $entities->count(),
            ],
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request): JsonResponse
    {
        $requestClass = $this->getStoreRequest();
        $validated = app($requestClass)->validated();

        $entity = $this->service->create(
            data: $validated,
            userId: auth()->id()
        );

        $resourceClass = $this->getResourceClass();

        return (new $resourceClass($entity))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource
     */
    public function show(Request $request, string $slug): JsonResponse
    {
        $entity = $this->service->getBySlug($slug);

        $resourceClass = $this->getResourceClass();

        return (new $resourceClass($entity))->toResponse($request);
    }

    // Note: update(), destroy(), toggleFeatured(), and toggleActive() methods
    // are intentionally not included in the base controller because they require
    // specific model type hints for route model binding to work properly.
    // Each child controller should implement these methods with their specific model types.
}
