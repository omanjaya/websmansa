<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSliderRequest;
use App\Http\Requests\UpdateSliderRequest;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SliderController extends Controller
{
    /**
     * Display active sliders (public endpoint).
     */
    public function index(): JsonResponse
    {
        $sliders = Slider::active()
            ->ordered()
            ->get();

        return response()->json([
            'data' => $sliders,
        ]);
    }

    /**
     * Store a newly created slider.
     */
    public function store(StoreSliderRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            // Don't set image field - will use Media Library instead
            unset($validated['image']);

            $slider = Slider::create($validated);

            // Handle image upload with auto-optimization
            if ($request->hasFile('image')) {
                \App\Services\MediaProcessingService::processAndUpload(
                    $slider,
                    $request->file('image'),
                    'slider_image',
                    ['alt' => $validated['title']]
                );
            }

            return response()->json([
                'message' => 'Slider berhasil dibuat',
                'data' => $slider->fresh()->load('media'),
            ], 201);
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error('Slider creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Gagal membuat slider: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified slider.
     */
    public function show(Slider $slider): JsonResponse
    {
        return response()->json([
            'data' => $slider,
        ]);
    }

    /**
     * Update the specified slider.
     */
    public function update(UpdateSliderRequest $request, Slider $slider): JsonResponse
    {
        $validated = $request->validated();

        // Handle image upload with auto-optimization
        if ($request->hasFile('image')) {
            // Delete old media library image
            $slider->clearMediaCollection('slider_image');
            
            // Delete old file-based image (backward compatibility)
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }

            // Upload new optimized image
            \App\Services\MediaProcessingService::processAndUpload(
                $slider,
                $request->file('image'),
                'slider_image',
                ['alt' => $validated['title'] ?? $slider->title]
            );
            
            // Don't set image field
            unset($validated['image']);
        }

        $slider->update($validated);

        return response()->json([
            'message' => 'Slider berhasil diperbarui',
            'data' => $slider->fresh()->load('media'),
        ]);
    }

    /**
     * Remove the specified slider.
     */
    public function destroy(Slider $slider): JsonResponse
    {
        // Delete media library images (auto-cleanup)
        $slider->clearMediaCollection('slider_image');
        
        // Delete old file-based image (backward compatibility)
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }

        $slider->delete();

        return response()->json([
            'message' => 'Slider berhasil dihapus',
        ]);
    }

    /**
     * Reorder sliders.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|exists:sliders,id',
            'sliders.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->sliders as $item) {
            Slider::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'message' => 'Urutan slider berhasil diperbarui',
        ]);
    }
}
