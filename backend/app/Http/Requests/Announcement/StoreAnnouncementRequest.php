<?php

declare(strict_types=1);

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;

final class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:announcements,slug',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'type' => 'required|string|in:info,event,warning,success',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'is_pinned' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:published_at',
            'category_id' => 'nullable|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul pengumuman wajib diisi',
            'title.max' => 'Judul maksimal 255 karakter',
            'slug.unique' => 'Slug sudah digunakan',
            'content.required' => 'Konten pengumuman wajib diisi',
            'excerpt.max' => 'Ringkasan maksimal 500 karakter',
            'type.required' => 'Tipe pengumuman wajib diisi',
            'type.in' => 'Tipe pengumuman harus salah satu dari: info, event, warning, success',
            'priority.required' => 'Prioritas wajib diisi',
            'priority.in' => 'Prioritas harus salah satu dari: low, medium, high, urgent',
            'expires_at.after' => 'Tanggal kadaluarsa harus setelah tanggal publish',
            'category_id.exists' => 'Kategori tidak ditemukan',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_pinned' => $this->boolean('is_pinned', false),
            'is_active' => $this->boolean('is_active', true),
        ]);
    }
}
