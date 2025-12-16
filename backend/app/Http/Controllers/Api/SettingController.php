<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Get all public settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::getAll();

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * Get settings by group.
     */
    public function getByGroup(string $group): JsonResponse
    {
        $settings = Setting::getByGroup($group);

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * Update multiple settings at once.
     */
    public function updateBatch(Request $request): JsonResponse
    {
        $this->authorize('manage-settings', Setting::class);

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'nullable|in:string,text,boolean,integer,json',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::set(
                $settingData['key'],
                $settingData['value'] ?? null,
                $settingData['type'] ?? 'string',
                $settingData['group'] ?? 'general'
            );
        }

        Setting::clearCache();

        return response()->json([
            'message' => 'Pengaturan berhasil diperbarui',
            'data' => Setting::getAll(),
        ]);
    }

    /**
     * Update a single setting.
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $this->authorize('manage-settings', Setting::class);

        $validated = $request->validate([
            'value' => 'nullable',
            'type' => 'nullable|in:string,text,boolean,integer,json',
            'group' => 'nullable|string',
        ]);

        Setting::set(
            $key,
            $validated['value'] ?? null,
            $validated['type'] ?? 'string',
            $validated['group'] ?? 'general'
        );

        return response()->json([
            'message' => 'Pengaturan berhasil diperbarui',
            'data' => [
                'key' => $key,
                'value' => Setting::get($key),
            ],
        ]);
    }
}
