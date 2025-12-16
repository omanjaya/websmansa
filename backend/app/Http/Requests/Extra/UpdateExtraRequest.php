<?php

declare(strict_types=1);

namespace App\Http\Requests\Extra;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateExtraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $extraId = $this->route('extra')?->id;

        return [
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:extras,slug,'.$extraId,
            'description' => 'sometimes|required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'sometimes|required|string|in:sports,arts,academic,social,technology,language,leadership,volunteer,religious',
            'schedule' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'nullable|email|max:255',
            'requirements' => 'nullable|array',
            'requirements.*' => 'string|max:255',
            'capacity' => 'nullable|integer|min:1|max:1000',
            'logo' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'string|max:255',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0|max:9999',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama ekstrakurikuler wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'slug.unique' => 'Slug sudah digunakan',
            'description.required' => 'Deskripsi wajib diisi',
            'short_description.max' => 'Deskripsi singkat maksimal 500 karakter',
            'category.required' => 'Kategori wajib diisi',
            'category.in' => 'Kategori harus salah satu dari: sports, arts, academic, social, technology, language, leadership, volunteer, religious',
            'schedule.max' => 'Jadwal maksimal 255 karakter',
            'contact_person.max' => 'Nama kontak maksimal 255 karakter',
            'contact_phone.max' => 'Nomor telepon maksimal 20 karakter',
            'contact_email.email' => 'Format email tidak valid',
            'contact_email.max' => 'Email maksimal 255 karakter',
            'requirements.*.max' => 'Setiap syarat maksimal 255 karakter',
            'capacity.min' => 'Kapasitas minimal 1 orang',
            'capacity.max' => 'Kapasitas maksimal 1000 orang',
            'order.min' => 'Urutan minimal 0',
            'order.max' => 'Urutan maksimal 9999',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
            'order' => $this->integer('order', 0),
        ]);
    }
}
