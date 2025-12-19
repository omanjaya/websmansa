<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get list of users (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::orderBy('name');

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) ($request->per_page ?? 20), 100);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Get a single user.
     */
    public function show(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => ['required', Rule::in(['super_admin', 'admin', 'editor', 'contributor'])],
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['password'] = Hash::make($data['password']);
        $data['uuid'] = (string) Str::uuid();

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = $file->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user = User::create($data);

        ActivityLog::log('create', "Membuat pengguna baru: {$user->name}", $user);

        return response()->json([
            'message' => 'Pengguna berhasil dibuat',
            'data' => $user,
        ], 201);
    }

    /**
     * Update a user.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ['sometimes', 'required', Rule::in(['super_admin', 'admin', 'editor', 'contributor'])],
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle password
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $file = $request->file('avatar');
            $path = $file->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $user->update($data);

        ActivityLog::log('update', "Memperbarui pengguna: {$user->name}", $user);

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui',
            'data' => $user->fresh(),
        ]);
    }

    /**
     * Delete a user.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Anda tidak bisa menghapus akun sendiri',
            ], 422);
        }

        // Prevent deleting the last super admin
        if ($user->role === 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return response()->json([
                    'message' => 'Tidak bisa menghapus super admin terakhir',
                ], 422);
            }
        }

        // Delete avatar
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        ActivityLog::log('delete', "Menghapus pengguna: {$user->name}", $user);

        $user->delete();

        return response()->json([
            'message' => 'Pengguna berhasil dihapus',
        ]);
    }

    /**
     * Toggle user active status.
     */
    public function toggleActive(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Prevent self-deactivation
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'Anda tidak bisa menonaktifkan akun sendiri',
            ], 422);
        }

        $user->update(['is_active' => !$user->is_active]);

        $status = $user->is_active ? 'mengaktifkan' : 'menonaktifkan';
        ActivityLog::log('update', ucfirst($status) . " pengguna: {$user->name}", $user);

        return response()->json([
            'message' => 'Status pengguna berhasil diperbarui',
            'data' => $user,
        ]);
    }

    /**
     * Get available roles.
     */
    public function roles(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['value' => 'super_admin', 'label' => 'Super Admin', 'description' => 'Akses penuh ke semua fitur'],
                ['value' => 'admin', 'label' => 'Admin', 'description' => 'Kelola konten dan pengguna'],
                ['value' => 'editor', 'label' => 'Editor', 'description' => 'Kelola dan publikasi konten'],
                ['value' => 'contributor', 'label' => 'Kontributor', 'description' => 'Membuat konten draft'],
            ],
        ]);
    }

    /**
     * Get user statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => User::count(),
            'active' => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
            'by_role' => User::selectRaw('role, COUNT(*) as count')
                ->groupBy('role')
                ->pluck('count', 'role')
                ->toArray(),
            'recently_active' => User::whereNotNull('last_login_at')
                ->where('last_login_at', '>=', now()->subDays(7))
                ->count(),
        ];

        return response()->json([
            'data' => $stats,
        ]);
    }
}
