<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Post;

use Illuminate\Foundation\Http\FormRequest;

final class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Simplified for testing - authorization is handled in controller with policy
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'string'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'type' => ['sometimes', 'string', 'in:post,page,announcement'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_pinned' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'categories' => ['sometimes', 'array'],
            'categories.*' => ['integer', 'exists:categories,id'],
            'meta' => ['sometimes', 'array'],
            'meta.title' => ['sometimes', 'string', 'max:255'],
            'meta.description' => ['sometimes', 'string', 'max:255'],
            'meta.keywords' => ['sometimes', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom error messages for defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi',
            'title.max' => 'Judul maksimal 255 karakter',
            'slug.unique' => 'Slug sudah digunakan',
            'excerpt.max' => 'Ringkasan maksimal 500 karakter',
            'content.required' => 'Konten wajib diisi',
            'featured_image.image' => 'Featured image harus berupa gambar',
            'featured_image.mimes' => 'Format gambar yang diperbolehkan: JPEG, PNG, WebP',
            'featured_image.max' => 'Ukuran gambar maksimal 5MB',
            'status.in' => 'Status tidak valid',
            'categories.*.exists' => 'Kategori tidak ditemukan',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'title' => 'Judul',
            'slug' => 'Slug',
            'excerpt' => 'Ringkasan',
            'content' => 'Konten',
            'featured_image' => 'Gambar utama',
            'status' => 'Status',
            'type' => 'Tipe',
            'categories' => 'Kategori',
            'published_at' => 'Tanggal publish',
        ];
    }
}
