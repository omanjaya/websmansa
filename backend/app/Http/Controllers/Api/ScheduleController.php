<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Schedule;
use App\Models\SchoolClass;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ScheduleController extends Controller
{
    /**
     * Get list of schedules.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Schedule::with(['schoolClass', 'subject', 'teacher:id,name,photo'])
            ->orderBy('day')
            ->orderBy('start_time');

        // Filters
        if ($request->filled('class_id')) {
            $query->byClass((int) $request->class_id);
        }

        if ($request->filled('teacher_id')) {
            $query->byTeacher((int) $request->teacher_id);
        }

        if ($request->filled('day')) {
            $query->byDay($request->day);
        }

        if ($request->filled('academic_year')) {
            $query->byAcademicYear($request->academic_year);
        }

        if ($request->filled('semester')) {
            $query->bySemester($request->semester);
        }

        if ($request->boolean('active_only', true)) {
            $query->active();
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('schoolClass', fn ($q2) => $q2->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('subject', fn ($q2) => $q2->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('teacher', fn ($q2) => $q2->where('name', 'like', "%{$search}%"))
                    ->orWhere('room', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);
        $schedules = $query->paginate($perPage);

        return response()->json([
            'data' => $schedules->items(),
            'meta' => [
                'current_page' => $schedules->currentPage(),
                'last_page' => $schedules->lastPage(),
                'per_page' => $schedules->perPage(),
                'total' => $schedules->total(),
            ],
        ]);
    }

    /**
     * Get schedule by class (grouped by day).
     */
    public function byClass(int $classId, Request $request): JsonResponse
    {
        $academicYear = $request->academic_year ?? $this->getCurrentAcademicYear();
        $semester = $request->semester ?? $this->getCurrentSemester();

        $schedules = Schedule::with(['subject', 'teacher:id,name,photo'])
            ->where('class_id', $classId)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get()
            ->groupBy('day');

        // Format by day
        $formatted = collect(Schedule::DAYS)->map(function ($label, $day) use ($schedules) {
            return [
                'day' => $day,
                'label' => $label,
                'schedules' => $schedules->get($day, collect())->values(),
            ];
        })->values();

        return response()->json([
            'data' => $formatted,
            'meta' => [
                'academic_year' => $academicYear,
                'semester' => $semester,
            ],
        ]);
    }

    /**
     * Get schedule by teacher (grouped by day).
     */
    public function byTeacher(int $teacherId, Request $request): JsonResponse
    {
        $academicYear = $request->academic_year ?? $this->getCurrentAcademicYear();
        $semester = $request->semester ?? $this->getCurrentSemester();

        $schedules = Schedule::with(['schoolClass', 'subject'])
            ->where('teacher_id', $teacherId)
            ->where('academic_year', $academicYear)
            ->where('semester', $semester)
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get()
            ->groupBy('day');

        // Format by day
        $formatted = collect(Schedule::DAYS)->map(function ($label, $day) use ($schedules) {
            return [
                'day' => $day,
                'label' => $label,
                'schedules' => $schedules->get($day, collect())->values(),
            ];
        })->values();

        return response()->json([
            'data' => $formatted,
            'meta' => [
                'academic_year' => $academicYear,
                'semester' => $semester,
            ],
        ]);
    }

    /**
     * Get a single schedule.
     */
    public function show(int $id): JsonResponse
    {
        $schedule = Schedule::with(['schoolClass', 'subject', 'teacher:id,name,photo'])->findOrFail($id);

        return response()->json([
            'data' => $schedule,
        ]);
    }

    /**
     * Create a new schedule.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:staff,id',
            'day' => ['required', Rule::in(array_keys(Schedule::DAYS))],
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
            'academic_year' => 'required|string|max:20',
            'semester' => ['required', Rule::in(['odd', 'even'])],
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check for conflicts
        $conflicts = Schedule::checkConflicts(
            $request->class_id,
            $request->day,
            $request->start_time,
            $request->end_time,
            $request->academic_year,
            $request->semester
        )->count();

        if ($conflicts > 0) {
            return response()->json([
                'message' => 'Jadwal bentrok dengan jadwal yang sudah ada',
                'errors' => ['time' => ['Jadwal bentrok dengan jadwal lain di waktu yang sama']],
            ], 422);
        }

        $schedule = Schedule::create($validator->validated());

        ActivityLog::log('create', "Membuat jadwal baru untuk kelas {$schedule->schoolClass->name}", $schedule);

        return response()->json([
            'message' => 'Jadwal berhasil dibuat',
            'data' => $schedule->load(['schoolClass', 'subject', 'teacher:id,name,photo']),
        ], 201);
    }

    /**
     * Update a schedule.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'class_id' => 'sometimes|required|exists:classes,id',
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'teacher_id' => 'nullable|exists:staff,id',
            'day' => ['sometimes', 'required', Rule::in(array_keys(Schedule::DAYS))],
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'room' => 'nullable|string|max:100',
            'academic_year' => 'sometimes|required|string|max:20',
            'semester' => ['sometimes', 'required', Rule::in(['odd', 'even'])],
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Check for conflicts (exclude current schedule)
        $data = $validator->validated();
        $conflicts = Schedule::checkConflicts(
            $data['class_id'] ?? $schedule->class_id,
            $data['day'] ?? $schedule->day,
            $data['start_time'] ?? $schedule->start_time,
            $data['end_time'] ?? $schedule->end_time,
            $data['academic_year'] ?? $schedule->academic_year,
            $data['semester'] ?? $schedule->semester,
            $schedule->id
        )->count();

        if ($conflicts > 0) {
            return response()->json([
                'message' => 'Jadwal bentrok dengan jadwal yang sudah ada',
                'errors' => ['time' => ['Jadwal bentrok dengan jadwal lain di waktu yang sama']],
            ], 422);
        }

        $schedule->update($data);

        ActivityLog::log('update', "Memperbarui jadwal kelas {$schedule->schoolClass->name}", $schedule);

        return response()->json([
            'message' => 'Jadwal berhasil diperbarui',
            'data' => $schedule->fresh(['schoolClass', 'subject', 'teacher:id,name,photo']),
        ]);
    }

    /**
     * Delete a schedule.
     */
    public function destroy(int $id): JsonResponse
    {
        $schedule = Schedule::findOrFail($id);

        ActivityLog::log('delete', "Menghapus jadwal kelas {$schedule->schoolClass->name}", $schedule);

        $schedule->delete();

        return response()->json([
            'message' => 'Jadwal berhasil dihapus',
        ]);
    }

    /**
     * Bulk delete schedules.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:schedules,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        Schedule::whereIn('id', $request->ids)->delete();

        ActivityLog::log('delete', "Menghapus " . count($request->ids) . " jadwal");

        return response()->json([
            'message' => 'Jadwal berhasil dihapus',
        ]);
    }

    /**
     * Get available academic years.
     */
    public function academicYears(): JsonResponse
    {
        $years = Schedule::distinct()
            ->pluck('academic_year')
            ->sort()
            ->values();

        // Add current if not exists
        $current = $this->getCurrentAcademicYear();
        if (!$years->contains($current)) {
            $years->push($current);
        }

        return response()->json([
            'data' => $years,
        ]);
    }

    /**
     * Get available days.
     */
    public function days(): JsonResponse
    {
        return response()->json([
            'data' => collect(Schedule::DAYS)->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])->values(),
        ]);
    }

    /**
     * Get current academic year.
     */
    private function getCurrentAcademicYear(): string
    {
        $now = now();
        $year = $now->year;
        $month = $now->month;

        // Academic year starts in July
        if ($month >= 7) {
            return "{$year}/" . ($year + 1);
        }
        
        return ($year - 1) . "/{$year}";
    }

    /**
     * Get current semester.
     */
    private function getCurrentSemester(): string
    {
        $month = now()->month;
        
        // Odd semester: July - December
        // Even semester: January - June
        return $month >= 7 && $month <= 12 ? 'odd' : 'even';
    }
}
