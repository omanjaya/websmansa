<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\SchoolClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchoolClassController extends Controller
{
    /**
     * Get list of classes.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SchoolClass::with(['homeroomTeacher:id,name,photo'])
            ->orderBy('grade')
            ->orderBy('major')
            ->orderBy('name');

        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        if ($request->filled('major')) {
            $query->where('major', $request->major);
        }

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('grade', 'like', "%{$search}%")
                    ->orWhere('major', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);
        $classes = $query->paginate($perPage);

        return response()->json([
            'data' => $classes->items(),
            'meta' => [
                'current_page' => $classes->currentPage(),
                'last_page' => $classes->lastPage(),
                'per_page' => $classes->perPage(),
                'total' => $classes->total(),
            ],
        ]);
    }

    /**
     * Get a single class.
     */
    public function show(int $id): JsonResponse
    {
        $class = SchoolClass::with(['homeroomTeacher:id,name,photo', 'schedules.subject', 'schedules.teacher:id,name'])->findOrFail($id);

        return response()->json([
            'data' => $class,
        ]);
    }

    /**
     * Create a new class.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'grade' => 'required|string|max:10',
            'major' => 'nullable|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:staff,id',
            'academic_year' => 'required|string|max:20',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $class = SchoolClass::create($validator->validated());

        ActivityLog::log('create', "Membuat kelas baru: {$class->name}", $class);

        return response()->json([
            'message' => 'Kelas berhasil dibuat',
            'data' => $class->load('homeroomTeacher:id,name,photo'),
        ], 201);
    }

    /**
     * Update a class.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $class = SchoolClass::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:50',
            'grade' => 'sometimes|required|string|max:10',
            'major' => 'nullable|string|max:50',
            'homeroom_teacher_id' => 'nullable|exists:staff,id',
            'academic_year' => 'sometimes|required|string|max:20',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $class->update($validator->validated());

        ActivityLog::log('update', "Memperbarui kelas: {$class->name}", $class);

        return response()->json([
            'message' => 'Kelas berhasil diperbarui',
            'data' => $class->fresh('homeroomTeacher:id,name,photo'),
        ]);
    }

    /**
     * Delete a class.
     */
    public function destroy(int $id): JsonResponse
    {
        $class = SchoolClass::findOrFail($id);

        // Check if class has schedules
        if ($class->schedules()->exists()) {
            return response()->json([
                'message' => 'Kelas tidak bisa dihapus karena masih memiliki jadwal',
            ], 422);
        }

        ActivityLog::log('delete', "Menghapus kelas: {$class->name}", $class);

        $class->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus',
        ]);
    }

    /**
     * Get available grades.
     */
    public function grades(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['value' => '10', 'label' => 'Kelas X'],
                ['value' => '11', 'label' => 'Kelas XI'],
                ['value' => '12', 'label' => 'Kelas XII'],
            ],
        ]);
    }

    /**
     * Get available majors.
     */
    public function majors(): JsonResponse
    {
        $majors = SchoolClass::distinct()
            ->whereNotNull('major')
            ->pluck('major')
            ->sort()
            ->values()
            ->map(fn ($major) => ['value' => $major, 'label' => $major]);

        return response()->json([
            'data' => $majors,
        ]);
    }
}
