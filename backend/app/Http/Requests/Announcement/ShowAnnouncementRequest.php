<?php

declare(strict_types=1);

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;

final class ShowAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'include' => 'nullable|string|in:user,category',
        ];
    }

    public function messages(): array
    {
        return [
            'include.in' => 'Include harus salah satu dari: user, category',
        ];
    }
}
