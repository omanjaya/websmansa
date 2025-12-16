<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGalleryRequest;
use App\Http\Requests\UpdateGalleryRequest;
use App\Models\Gallery;
use App\Models\GalleryItem;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class GalleryController extends Controller
{
    /**
     * Display a listing of galleries.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query()->with('items.media');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        match ($sort) {
            'oldest' => $query->orderBy('event_date', 'asc')->orderBy('created_at', 'asc'),
            'title' => $query->orderBy('title', 'asc'),
            default => $query->latest(),
        };

        $perPage = min($request->integer('per_page', 12), 50);
        $galleries = $query->paginate($perPage);

        return response()->json([
            'data' => $galleries->items(),
            'meta' => [
                'current_page' => $galleries->currentPage(),
                'last_page' => $galleries->lastPage(),
                'per_page' => $galleries->perPage(),
                'total' => $galleries->total(),
            ],
        ]);
    }

    /**
     * Store a newly created gallery.
     */
    public function store(StoreGalleryRequest $request): JsonResponse
    {
        $this->authorize('create', Gallery::class);

        try {
            DB::beginTransaction();

            $data = $request->validated();

            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            // Don't set thumbnail field - will use Media Library instead
            unset($data['thumbnail']);

            $gallery = Gallery::create($data);

            // Handle thumbnail upload with auto-optimization
            if ($request->hasFile('thumbnail')) {
                \App\Services\MediaProcessingService::processAndUpload(
                    $gallery,
                    $request->file('thumbnail'),
                    'thumbnail',
                    ['alt' => $data['title']]
                );
            }

            // Handle media items if provided
            if ($request->has('media_ids')) {
                $this->attachMediaItems($gallery, $request->input('media_ids'));
            }

            DB::commit();

            return response()->json([
                'message' => 'Galeri berhasil dibuat.',
                'data' => $gallery->load('items.media', 'media'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal membuat galeri.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified gallery.
     */
    public function show(string $slug): JsonResponse
    {
        $gallery = Gallery::where('slug', $slug)
            ->with(['items.media'])
            ->firstOrFail();

        return response()->json([
            'data' => $gallery,
        ]);
    }

    /**
     * Update the specified gallery.
     */
    public function update(UpdateGalleryRequest $request, Gallery $gallery): JsonResponse
    {
        $this->authorize('update', $gallery);

        try {
            DB::beginTransaction();

            $data = $request->validated();

            // Handle thumbnail upload with auto-optimization
            if ($request->hasFile('thumbnail')) {
                // Delete old media library thumbnail
                $gallery->clearMediaCollection('thumbnail');
                
                // Delete old file-based thumbnail (backward compatibility)
                if ($gallery->thumbnail) {
                    Storage::disk('public')->delete($gallery->thumbnail);
                }

                // Upload new optimized thumbnail
                \App\Services\MediaProcessingService::processAndUpload(
                    $gallery,
                    $request->file('thumbnail'),
                    'thumbnail',
                    ['alt' => $data['title'] ?? $gallery->title]
                );
                
                // Don't set thumbnail field
                unset($data['thumbnail']);
            }

            $gallery->update($data);

            // Update media items if provided
            if ($request->has('media_ids')) {
                // Remove existing items
                $gallery->items()->delete();
                // Add new items
                $this->attachMediaItems($gallery, $request->input('media_ids'));
            }

            DB::commit();

            return response()->json([
                'message' => 'Galeri berhasil diperbarui.',
                'data' => $gallery->fresh(['items.media', 'media']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal memperbarui galeri.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified gallery.
     */
    public function destroy(Gallery $gallery): JsonResponse
    {
        $this->authorize('delete', $gallery);

        try {
            DB::beginTransaction();

            // Delete thumbnail
            if ($gallery->thumbnail) {
                Storage::disk('public')->delete($gallery->thumbnail);
            }

            // Delete gallery (items will be cascade deleted)
            $gallery->delete();

            DB::commit();

            return response()->json([
                'message' => 'Galeri berhasil dihapus.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal menghapus galeri.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add items to gallery.
     */
    public function addItems(Request $request, Gallery $gallery): JsonResponse
    {
        $this->authorize('update', $gallery);

        $request->validate([
            'media_ids' => 'required|array',
            'media_ids.*' => 'required|exists:media,id',
        ]);

        try {
            $this->attachMediaItems($gallery, $request->input('media_ids'));

            return response()->json([
                'message' => 'Item berhasil ditambahkan ke galeri.',
                'data' => $gallery->fresh(['items.media']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan item.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove item from gallery.
     */
    public function removeItem(Gallery $gallery, GalleryItem $item): JsonResponse
    {
        $this->authorize('update', $gallery);

        if ($item->gallery_id !== $gallery->id) {
            return response()->json([
                'message' => 'Item tidak ditemukan di galeri ini.',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'message' => 'Item berhasil dihapus dari galeri.',
        ]);
    }

    /**
     * Reorder gallery items.
     */
    public function reorderItems(Request $request, Gallery $gallery): JsonResponse
    {
        $this->authorize('update', $gallery);

        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:gallery_items,id',
            'items.*.order' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->input('items') as $item) {
                GalleryItem::where('id', $item['id'])
                    ->where('gallery_id', $gallery->id)
                    ->update(['order' => $item['order']]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Urutan item berhasil diperbarui.',
                'data' => $gallery->fresh(['items.media']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal mengubah urutan item.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload media to gallery.
     */
    public function uploadMedia(Request $request, Gallery $gallery): JsonResponse
    {
        $this->authorize('update', $gallery);

        $request->validate([
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,webp,mp4|max:10240', // 10MB
            'captions' => 'nullable|array',
            'captions.*' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $uploadedMedia = [];
            $files = $request->file('files');
            $captions = $request->input('captions', []);

            foreach ($files as $index => $file) {
                // Store file
                $path = $file->store('galleries', 'public');

                // Get image dimensions if it's an image
                $width = null;
                $height = null;
                if (Str::startsWith($file->getMimeType(), 'image/')) {
                    [$width, $height] = getimagesize($file->getRealPath());
                }

                // Create media record
                $media = Media::create([
                    'user_id' => auth()->id(),
                    'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                    'file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'path' => $path,
                    'disk' => 'public',
                    'size' => $file->getSize(),
                    'width' => $width,
                    'height' => $height,
                ]);

                // Create gallery item
                $caption = $captions[$index] ?? null;
                GalleryItem::create([
                    'gallery_id' => $gallery->id,
                    'media_id' => $media->id,
                    'caption' => $caption,
                ]);

                $uploadedMedia[] = $media;
            }

            DB::commit();

            return response()->json([
                'message' => count($uploadedMedia).' file berhasil diupload.',
                'data' => $gallery->fresh(['items.media']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal mengupload file.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper method to attach media items to gallery.
     */
    private function attachMediaItems(Gallery $gallery, array $mediaIds): void
    {
        foreach ($mediaIds as $index => $mediaId) {
            GalleryItem::create([
                'gallery_id' => $gallery->id,
                'media_id' => $mediaId,
                'order' => $index + 1,
            ]);
        }
    }
}
