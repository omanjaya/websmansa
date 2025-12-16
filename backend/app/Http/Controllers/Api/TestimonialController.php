<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::featured()->ordered()->get();
        return response()->json(['data' => $testimonials]);
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('testimonials', 'public');
        }
        return response()->json(['data' => Testimonial::create($data)], 201);
    }

    public function update(StoreTestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            if ($testimonial->photo) Storage::disk('public')->delete($testimonial->photo);
            $data['photo'] = $request->file('photo')->store('testimonials', 'public');
        }
        $testimonial->update($data);
        return response()->json(['data' => $testimonial]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        if ($testimonial->photo) Storage::disk('public')->delete($testimonial->photo);
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted']);
    }
}
