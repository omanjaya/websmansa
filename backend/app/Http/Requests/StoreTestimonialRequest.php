<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'content' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'order' => 'integer|min:0',
        ];
    }
}
