<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactMessageController extends Controller
{
    /**
     * Get list of contact messages (admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::with('repliedByUser:id,name')
            ->latest();

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);
        $messages = $query->paginate($perPage);

        return response()->json([
            'data' => $messages->items(),
            'meta' => [
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }

    /**
     * Get a single message.
     */
    public function show(int $id): JsonResponse
    {
        $message = ContactMessage::with('repliedByUser:id,name')->findOrFail($id);

        // Auto mark as read
        $message->markAsRead();

        return response()->json([
            'data' => $message,
        ]);
    }

    /**
     * Store a new message (public - from contact form).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $message = ContactMessage::create([
            ...$validator->validated(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim. Kami akan segera menghubungi Anda.',
            'data' => $message,
        ], 201);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->markAsRead();

        return response()->json([
            'message' => 'Pesan ditandai sudah dibaca',
            'data' => $message,
        ]);
    }

    /**
     * Mark message as replied.
     */
    public function markAsReplied(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $message = ContactMessage::findOrFail($id);
        $message->markAsReplied($request->admin_notes);

        ActivityLog::log('reply', "Membalas pesan dari {$message->name}", $message);

        return response()->json([
            'message' => 'Pesan ditandai sudah dibalas',
            'data' => $message->fresh(['repliedByUser:id,name']),
        ]);
    }

    /**
     * Archive a message.
     */
    public function archive(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->archive();

        ActivityLog::log('archive', "Mengarsipkan pesan dari {$message->name}", $message);

        return response()->json([
            'message' => 'Pesan berhasil diarsipkan',
            'data' => $message,
        ]);
    }

    /**
     * Delete a message.
     */
    public function destroy(int $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);

        ActivityLog::log('delete', "Menghapus pesan dari {$message->name}", $message);

        $message->delete();

        return response()->json([
            'message' => 'Pesan berhasil dihapus',
        ]);
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:contact_messages,id',
            'status' => 'required|in:read,replied,archived',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = ['status' => $request->status];

        if ($request->status === 'replied') {
            $updateData['replied_by'] = auth()->id();
            $updateData['replied_at'] = now();
        }

        ContactMessage::whereIn('id', $request->ids)->update($updateData);

        return response()->json([
            'message' => 'Status pesan berhasil diperbarui',
        ]);
    }

    /**
     * Bulk delete.
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:contact_messages,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        ContactMessage::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'Pesan berhasil dihapus',
        ]);
    }

    /**
     * Get statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => ContactMessage::count(),
            'unread' => ContactMessage::unread()->count(),
            'read' => ContactMessage::read()->count(),
            'replied' => ContactMessage::replied()->count(),
            'archived' => ContactMessage::archived()->count(),
            'today' => ContactMessage::whereDate('created_at', today())->count(),
            'this_week' => ContactMessage::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => ContactMessage::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }
}
