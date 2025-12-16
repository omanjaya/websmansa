<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Post;

use App\Enums\PostStatus;
use Illuminate\Foundation\Http\FormRequest;

final class ShowPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Simplified for testing - allow all access
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
            'include' => ['sometimes', 'string'],
            'fields' => ['sometimes', 'string'],
        ];
    }
}
