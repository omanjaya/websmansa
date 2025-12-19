<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SubjectController extends Controller
{
    /**
     * Get list of subjects.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subject::orderBy('category')
            ->orderBy('name');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) ($request->per_page ?? 50), 100);
        $subjects = $query->paginate($perPage);

        return response()->json([
            'data' => $subjects->items(),
            'meta' => [
                'current_page' => $subjects->currentPage(),
                'last_page' => $subjects->lastPage(),
                'per_page' => $subjects->perPage(),
                'total' => $subjects->total(),
            ],
        ]);
    }

    /**
     * Get a single subject.
     */
    public function show(int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        return response()->json([
            'data' => $subject,
        ]);
    }

    /**
     * Create a new subject.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:20|unique:subjects,code',
            'name' => 'required|string|max:255',
            'category' => ['nullable', Rule::in(array_keys(Subject::CATEGORIES))],
            'credit_hours' => 'required|integer|min:1|max:10',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subject = Subject::create($validator->validated());

        ActivityLog::log('create', "Membuat mata pelajaran baru: {$subject->name}", $subject);

        return response()->json([
            'message' => 'Mata pelajaran berhasil dibuat',
            'data' => $subject,
        ], 201);
    }

    /**
     * Update a subject.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('subjects', 'code')->ignore($id)],
            'name' => 'sometimes|required|string|max:255',
            'category' => ['nullable', Rule::in(array_keys(Subject::CATEGORIES))],
            'credit_hours' => 'sometimes|required|integer|min:1|max:10',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subject->update($validator->validated());

        ActivityLog::log('update', "Memperbarui mata pelajaran: {$subject->name}", $subject);

        return response()->json([
            'message' => 'Mata pelajaran berhasil diperbarui',
            'data' => $subject->fresh(),
        ]);
    }

    /**
     * Delete a subject.
     */
    public function destroy(int $id): JsonResponse
    {
        $subject = Subject::findOrFail($id);

        // Check if subject has schedules
        if ($subject->schedules()->exists()) {
            return response()->json([
                'message' => 'Mata pelajaran tidak bisa dihapus karena masih digunakan di jadwal',
            ], 422);
        }

        ActivityLog::log('delete', "Menghapus mata pelajaran: {$subject->name}", $subject);

        $subject->delete();

        return response()->json([
            'message' => 'Mata pelajaran berhasil dihapus',
        ]);
    }

    /**
     * Get available categories.
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => collect(Subject::CATEGORIES)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
        ]);
    }
}
