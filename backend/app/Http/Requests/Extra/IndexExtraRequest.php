<?php

declare(strict_types=1);

namespace App\Http\Requests\Extra;

use Illuminate\Foundation\Http\FormRequest;

final class IndexExtraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => 'nullable|string|in:sports,arts,academic,social,technology,language,leadership,volunteer,religious',
            'is_active' => 'nullable|in:0,1,true,false',
            'is_featured' => 'nullable|in:0,1,true,false',
            'limit' => 'nullable|integer|min:1|max:100',
            'paginate' => 'nullable|in:0,1,true,false',
        ];
    }

    public function messages(): array
    {
        return [
            'category.in' => 'Kategori ekstrakurikuler harus salah satu dari: sports, arts, academic, social, technology, language, leadership, volunteer, religious',
            'limit.min' => 'Limit minimal adalah 1',
            'limit.max' => 'Limit maksimal adalah 100',
        ];
    }
}
