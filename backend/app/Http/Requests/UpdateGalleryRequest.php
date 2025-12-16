<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGalleryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $galleryId = $this->route('gallery');

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('galleries', 'slug')->ignore($galleryId),
            ],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', 'required', Rule::in(['photo', 'video', 'mixed'])],
            'event_date' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
            'thumbnail' => ['nullable', 'image', 'max:5120'], // 5MB
        ];
    }

    /**
     * Get custom attribute names.
     */
    public function attributes(): array
    {
        return [
            'title' => 'judul galeri',
            'description' => 'deskripsi',
            'type' => 'tipe galeri',
            'event_date' => 'tanggal acara',
            'is_featured' => 'unggulan',
            'thumbnail' => 'gambar thumbnail',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => ':attribute harus diisi.',
            'title.max' => ':attribute tidak boleh lebih dari :max karakter.',
            'type.required' => ':attribute harus dipilih.',
            'type.in' => ':attribute yang dipilih tidak valid.',
            'thumbnail.image' => ':attribute harus berupa gambar.',
            'thumbnail.max' => ':attribute tidak boleh lebih dari 5MB.',
        ];
    }
}
