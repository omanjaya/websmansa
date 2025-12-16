<?php

declare(strict_types=1);

namespace App\Http\Requests\Facility;

use Illuminate\Foundation\Http\FormRequest;

final class StoreFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:facilities,slug',
            'description' => 'required|string',
            'category' => 'required|string|in:classroom,laboratory,library,sports,canteen,health,auditorium,multipurpose,parking,worship,toilet,garden,computer,science,language,art,music',
            'location' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1|max:10000',
            'area' => 'nullable|integer|min:1|max:100000',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'images' => 'nullable|array',
            'images.*' => 'string|max:255',
            'rules' => 'nullable|array',
            'rules.*' => 'string|max:500',
            'booking_url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0|max:9999',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama fasilitas wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'slug.unique' => 'Slug sudah digunakan',
            'description.required' => 'Deskripsi wajib diisi',
            'category.required' => 'Kategori wajib diisi',
            'category.in' => 'Kategori harus salah satu dari: classroom, laboratory, library, sports, canteen, health, auditorium, multipurpose, parking, worship, toilet, garden, computer, science, language, art, music',
            'location.max' => 'Lokasi maksimal 255 karakter',
            'capacity.min' => 'Kapasitas minimal 1 orang',
            'capacity.max' => 'Kapasitas maksimal 10000 orang',
            'area.min' => 'Luas minimal 1 m²',
            'area.max' => 'Luas maksimal 100000 m²',
            'facilities.*.max' => 'Setiap fasilitas maksimal 255 karakter',
            'images.*.max' => 'Setiap gambar maksimal 255 karakter',
            'rules.*.max' => 'Setiap aturan maksimal 500 karakter',
            'booking_url.url' => 'URL pemesanan tidak valid',
            'booking_url.max' => 'URL pemesanan maksimal 500 karakter',
            'order.min' => 'Urutan minimal 0',
            'order.max' => 'Urutan maksimal 9999',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
            'is_featured' => $this->boolean('is_featured', false),
            'order' => $this->integer('order', 0),
        ]);
    }
}
