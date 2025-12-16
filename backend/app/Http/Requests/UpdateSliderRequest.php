<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSliderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'link' => 'nullable|url|max:500',
            'button_text' => 'nullable|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul slider wajib diisi',
            'title.max' => 'Judul slider maksimal 255 karakter',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus: jpeg, png, jpg, gif, atau webp',
            'image.max' => 'Ukuran gambar maksimal 5MB',
            'link.url' => 'Link harus berupa URL yang valid',
            'link.max' => 'Link maksimal 500 karakter',
            'button_text.max' => 'Teks tombol maksimal 100 karakter',
            'order.integer' => 'Urutan harus berupa angka',
            'order.min' => 'Urutan minimal 0',
        ];
    }
}
