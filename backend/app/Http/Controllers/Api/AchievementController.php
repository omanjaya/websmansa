<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class AchievementController extends Controller
{
    /**
     * Display a listing of active achievements.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Achievement::query()->active();

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by year
        if ($request->has('year')) {
            $query->byYear((int) $request->year);
        }

        // Filter by level
        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Search by title
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%")
                    ->orWhere('organizer', 'like', "%{$request->search}%");
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'oldest' => $query->orderBy('achievement_date', 'asc')->orderBy('year', 'asc'),
            'title' => $query->orderBy('title', 'asc'),
            'order' => $query->ordered(),
            default => $query->latest(),
        };

        $perPage = min($request->integer('per_page', 12), 50);
        $achievements = $query->paginate($perPage);

        return response()->json([
            'data' => $achievements->items(),
            'meta' => [
                'current_page' => $achievements->currentPage(),
                'last_page' => $achievements->lastPage(),
                'per_page' => $achievements->perPage(),
                'total' => $achievements->total(),
            ],
        ]);
    }

    /**
     * Get featured achievements for homepage carousel.
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->integer('limit', 6), 20);

        $achievements = Achievement::query()
            ->active()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $achievements,
        ]);
    }

    /**
     * Get latest achievements.
     */
    public function latest(Request $request): JsonResponse
    {
        $limit = min($request->integer('limit', 6), 20);

        $achievements = Achievement::query()
            ->active()
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $achievements,
        ]);
    }

    /**
     * Display the specified achievement.
     */
    public function show(string $slug): JsonResponse
    {
        $achievement = Achievement::query()
            ->active()
            ->where('slug', $slug)
            ->orWhere('uuid', $slug)
            ->firstOrFail();

        return response()->json([
            'data' => $achievement,
        ]);
    }

    /**
     * Get available categories.
     */
    public function categories(): JsonResponse
    {
        $categories = Achievement::query()
            ->active()
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Get available years.
     */
    public function years(): JsonResponse
    {
        $years = Achievement::query()
            ->active()
            ->distinct()
            ->pluck('year')
            ->sort()
            ->reverse()
            ->values();

        return response()->json([
            'data' => $years,
        ]);
    }

    /**
     * Store a newly created achievement (admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Achievement::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:achievements,slug',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'year' => 'required|integer|min:1960|max:' . date('Y'),
            'level' => 'required|string|in:school,regional,national,international',
            'organizer' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'participants' => 'nullable|array',
            'coach' => 'nullable|string|max:255',
            'medal_type' => 'nullable|string|in:gold,silver,bronze,winner,finalist',
            'rank' => 'nullable|integer|min:1',
            'achievement_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('achievements', 'public');
            }

            $achievement = Achievement::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Prestasi berhasil ditambahkan.',
                'data' => $achievement,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal menambahkan prestasi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified achievement (admin).
     */
    public function update(Request $request, Achievement $achievement): JsonResponse
    {
        $this->authorize('update', $achievement);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:achievements,slug,' . $achievement->id,
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:100',
            'year' => 'sometimes|required|integer|min:1960|max:' . date('Y'),
            'level' => 'sometimes|required|string|in:school,regional,national,international',
            'organizer' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'participants' => 'nullable|array',
            'coach' => 'nullable|string|max:255',
            'medal_type' => 'nullable|string|in:gold,silver,bronze,winner,finalist',
            'rank' => 'nullable|integer|min:1',
            'achievement_date' => 'nullable|date',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('image')) {
                // Delete old image
                if ($achievement->image) {
                    Storage::disk('public')->delete($achievement->image);
                }
                $validated['image'] = $request->file('image')->store('achievements', 'public');
            }

            $achievement->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Prestasi berhasil diperbarui.',
                'data' => $achievement->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal memperbarui prestasi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified achievement (admin).
     */
    public function destroy(Achievement $achievement): JsonResponse
    {
        $this->authorize('delete', $achievement);

        try {
            // Delete image
            if ($achievement->image) {
                Storage::disk('public')->delete($achievement->image);
            }

            $achievement->delete();

            return response()->json([
                'message' => 'Prestasi berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus prestasi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle featured status (admin).
     */
    public function toggleFeatured(Achievement $achievement): JsonResponse
    {
        $this->authorize('update', $achievement);

        $achievement->update(['is_featured' => !$achievement->is_featured]);

        return response()->json([
            'message' => 'Status featured berhasil diubah.',
            'data' => $achievement->fresh(),
        ]);
    }

    /**
     * Toggle active status (admin).
     */
    public function toggleActive(Achievement $achievement): JsonResponse
    {
        $this->authorize('update', $achievement);

        $achievement->update(['is_active' => !$achievement->is_active]);

        return response()->json([
            'message' => 'Status active berhasil diubah.',
            'data' => $achievement->fresh(),
        ]);
    }
}
