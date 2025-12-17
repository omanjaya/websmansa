<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Get all public settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::where('is_public', true)
            ->orderBy('group')
            ->orderBy('order')
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $this->castValue($setting->value, $setting->type)];
            });

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * Get settings by group.
     */
    public function getByGroup(string $group): JsonResponse
    {
        $settings = Setting::where('group', $group)
            ->where('is_public', true)
            ->orderBy('order')
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => $this->castValue($setting->value, $setting->type)];
            });

        return response()->json([
            'data' => $settings,
        ]);
    }

    /**
     * Get a single setting by key.
     */
    public function getByKey(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)
            ->where('is_public', true)
            ->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Setting not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'key' => $setting->key,
                'value' => $this->castValue($setting->value, $setting->type),
                'type' => $setting->type,
            ],
        ]);
    }

    /**
     * Get all settings (admin only).
     */
    public function adminIndex(): JsonResponse
    {
        $settings = Setting::orderBy('group')
            ->orderBy('order')
            ->get();

        $grouped = $settings->groupBy('group');
        $groups = $settings->pluck('group')->unique()->sort()->values();

        return response()->json([
            'data' => $settings,
            'groups' => $groups,
            'grouped' => $grouped,
        ]);
    }

    /**
     * Get list of setting groups (admin only).
     */
    public function getGroups(): JsonResponse
    {
        $groups = Setting::select('group')
            ->distinct()
            ->orderBy('group')
            ->pluck('group');

        return response()->json([
            'data' => $groups,
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

    /**
     * Upload file for a setting.
     */
    public function upload(Request $request): JsonResponse
    {
        $this->authorize('manage-settings', Setting::class);

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg,ico|max:2048',
            'key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $key = $request->input('key');

        // Store the file
        $path = $file->store('settings', 'public');
        $url = Storage::url($path);

        // Update the setting with the file URL
        Setting::set($key, $url);

        Setting::clearCache();

        return response()->json([
            'message' => 'File uploaded successfully',
            'data' => [
                'key' => $key,
                'url' => $url,
            ],
        ]);
    }

    /**
     * Cast value based on type.
     */
    private function castValue($value, $type)
    {
        switch ($type) {
            case 'boolean':
                return (bool) $value;
            case 'integer':
                return (int) $value;
            case 'json':
                return json_decode($value, true);
            default:
                return $value;
        }
    }
}
