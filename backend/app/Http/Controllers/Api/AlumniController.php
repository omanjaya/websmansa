<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alumni;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class AlumniController extends Controller
{
    /**
     * Display a listing of public alumni.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Alumni::query()->public();

        // Filter by graduation year
        if ($request->has('year')) {
            $query->byYear((int) $request->year);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Search by name
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('current_occupation', 'like', "%{$request->search}%")
                    ->orWhere('current_institution', 'like', "%{$request->search}%");
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'oldest' => $query->orderBy('graduation_year', 'asc'),
            'name' => $query->orderBy('name', 'asc'),
            'order' => $query->ordered(),
            default => $query->latest(),
        };

        $perPage = min($request->integer('per_page', 12), 50);
        $alumni = $query->paginate($perPage);

        return response()->json([
            'data' => $alumni->items(),
            'meta' => [
                'current_page' => $alumni->currentPage(),
                'last_page' => $alumni->lastPage(),
                'per_page' => $alumni->perPage(),
                'total' => $alumni->total(),
            ],
        ]);
    }

    /**
     * Get featured alumni for homepage carousel.
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = min($request->integer('limit', 6), 20);

        $alumni = Alumni::query()
            ->public()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $alumni,
        ]);
    }

    /**
     * Display the specified alumni.
     */
    public function show(string $id): JsonResponse
    {
        $alumni = Alumni::query()
            ->public()
            ->where('id', $id)
            ->orWhere('uuid', $id)
            ->firstOrFail();

        return response()->json([
            'data' => $alumni,
        ]);
    }

    /**
     * Get available categories.
     */
    public function categories(): JsonResponse
    {
        $categories = Alumni::query()
            ->public()
            ->whereNotNull('category')
            ->distinct()
            ->pluck('category')
            ->sort()
            ->values();

        return response()->json([
            'data' => $categories,
        ]);
    }

    /**
     * Get available graduation years.
     */
    public function years(): JsonResponse
    {
        $years = Alumni::query()
            ->public()
            ->distinct()
            ->pluck('graduation_year')
            ->sort()
            ->reverse()
            ->values();

        return response()->json([
            'data' => $years,
        ]);
    }

    /**
     * Store a newly created alumni (admin).
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Alumni::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'graduation_year' => 'required|integer|min:1960|max:' . date('Y'),
            'class' => 'nullable|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'current_occupation' => 'nullable|string|max:255',
            'current_institution' => 'nullable|string|max:255',
            'achievements' => 'nullable|string',
            'bio' => 'nullable|string',
            'quote' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'is_public' => 'boolean',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('photo')) {
                $validated['photo'] = $request->file('photo')->store('alumni', 'public');
            }

            $alumni = Alumni::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Alumni berhasil ditambahkan.',
                'data' => $alumni,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal menambahkan alumni.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified alumni (admin).
     */
    public function update(Request $request, Alumni $alumni): JsonResponse
    {
        $this->authorize('update', $alumni);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'graduation_year' => 'sometimes|required|integer|min:1960|max:' . date('Y'),
            'class' => 'nullable|string|max:50',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'current_occupation' => 'nullable|string|max:255',
            'current_institution' => 'nullable|string|max:255',
            'achievements' => 'nullable|string',
            'bio' => 'nullable|string',
            'quote' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'is_public' => 'boolean',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        try {
            DB::beginTransaction();

            if ($request->hasFile('photo')) {
                // Delete old photo
                if ($alumni->photo) {
                    Storage::disk('public')->delete($alumni->photo);
                }
                $validated['photo'] = $request->file('photo')->store('alumni', 'public');
            }

            $alumni->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Alumni berhasil diperbarui.',
                'data' => $alumni->fresh(),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal memperbarui alumni.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified alumni (admin).
     */
    public function destroy(Alumni $alumni): JsonResponse
    {
        $this->authorize('delete', $alumni);

        try {
            // Delete photo
            if ($alumni->photo) {
                Storage::disk('public')->delete($alumni->photo);
            }

            $alumni->delete();

            return response()->json([
                'message' => 'Alumni berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus alumni.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle featured status (admin).
     */
    public function toggleFeatured(Alumni $alumni): JsonResponse
    {
        $this->authorize('update', $alumni);

        $alumni->update(['is_featured' => !$alumni->is_featured]);

        return response()->json([
            'message' => 'Status featured berhasil diubah.',
            'data' => $alumni->fresh(),
        ]);
    }

    /**
     * Toggle public status (admin).
     */
    public function togglePublic(Alumni $alumni): JsonResponse
    {
        $this->authorize('update', $alumni);

        $alumni->update(['is_public' => !$alumni->is_public]);

        return response()->json([
            'message' => 'Status public berhasil diubah.',
            'data' => $alumni->fresh(),
        ]);
    }
}
