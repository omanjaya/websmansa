<?php

declare(strict_types=1);

namespace App\Http\Requests\Facility;

use Illuminate\Foundation\Http\FormRequest;

final class ShowFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'include' => 'nullable|string|in:user',
        ];
    }

    public function messages(): array
    {
        return [
            'include.in' => 'Include harus salah satu dari: user',
        ];
    }
}
