<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ActivityLogController extends Controller
{
    /**
     * Get list of activity logs (admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user:id,name,email')
            ->latest();

        // Filters
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('model_type')) {
            $query->where('model_type', 'like', "%{$request->model_type}%");
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);
        $logs = $query->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    /**
     * Get a single activity log.
     */
    public function show(int $id): JsonResponse
    {
        $log = ActivityLog::with('user:id,name,email')->findOrFail($id);

        return response()->json([
            'data' => $log,
        ]);
    }

    /**
     * Get activity statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        $days = (int) ($request->days ?? 30);
        $fromDate = now()->subDays($days);

        $stats = [
            'total' => ActivityLog::where('created_at', '>=', $fromDate)->count(),
            'by_action' => ActivityLog::where('created_at', '>=', $fromDate)
                ->selectRaw('action, COUNT(*) as count')
                ->groupBy('action')
                ->orderByDesc('count')
                ->get()
                ->pluck('count', 'action')
                ->toArray(),
            'by_user' => ActivityLog::where('created_at', '>=', $fromDate)
                ->with('user:id,name')
                ->selectRaw('user_id, COUNT(*) as count')
                ->groupBy('user_id')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(fn ($item) => [
                    'user' => $item->user?->name ?? 'System',
                    'count' => $item->count,
                ])
                ->toArray(),
            'by_model' => ActivityLog::where('created_at', '>=', $fromDate)
                ->whereNotNull('model_type')
                ->selectRaw('model_type, COUNT(*) as count')
                ->groupBy('model_type')
                ->orderByDesc('count')
                ->get()
                ->map(fn ($item) => [
                    'model' => class_basename($item->model_type),
                    'count' => $item->count,
                ])
                ->toArray(),
            'daily_trend' => ActivityLog::where('created_at', '>=', $fromDate)
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->pluck('count', 'date')
                ->toArray(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }

    /**
     * Get available actions.
     */
    public function actions(): JsonResponse
    {
        $actions = ActivityLog::distinct()
            ->pluck('action')
            ->map(fn ($action) => [
                'value' => $action,
                'label' => match ($action) {
                    'create' => 'Membuat',
                    'update' => 'Mengubah',
                    'delete' => 'Menghapus',
                    'login' => 'Login',
                    'logout' => 'Logout',
                    'upload' => 'Mengunggah',
                    'publish' => 'Mempublikasi',
                    default => ucfirst($action),
                },
            ])
            ->values();

        return response()->json([
            'data' => $actions,
        ]);
    }

    /**
     * Get recent activities for dashboard.
     */
    public function recent(Request $request): JsonResponse
    {
        $limit = min((int) ($request->limit ?? 10), 50);

        $logs = ActivityLog::with('user:id,name')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn ($log) => [
                'id' => $log->id,
                'type' => $log->model_type_label ?? 'System',
                'title' => $log->action_label,
                'description' => $log->description,
                'icon' => $log->icon,
                'color' => $log->color,
                'user' => $log->user?->name ?? 'System',
                'timestamp' => $log->created_at,
            ]);

        return response()->json([
            'data' => $logs,
        ]);
    }
}
