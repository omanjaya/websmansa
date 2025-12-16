<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\Post;

use Illuminate\Foundation\Http\FormRequest;

final class IndexPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'category' => ['sometimes', 'string'],
            'search' => ['sometimes', 'string', 'max:255'],
            'sort' => ['sometimes', 'string', 'regex:/^-?[a-zA-Z_]+(,-?[a-zA-Z_]+)?$/'],
            'status' => ['sometimes', 'string', 'in:draft,published,archived'],
            'include' => ['sometimes', 'string'],
            'fields' => ['sometimes', 'string'],
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
            'per_page.max' => 'Maksimal item per halaman adalah 100',
            'category.string' => 'Kategori harus berupa string',
            'search.max' => 'Kata kunci pencarian maksimal 255 karakter',
            'sort.regex' => 'Format sorting tidak valid',
            'status.in' => 'Status harus salah satu dari: draft, published, archived',
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
            'page' => 'Halaman',
            'per_page' => 'Item per halaman',
            'category' => 'Kategori',
            'search' => 'Kata kunci',
            'sort' => 'Urutan',
            'status' => 'Status',
        ];
    }

    /**
     * Get validated filters for post query.
     */
    public function validatedFilters(): array
    {
        $validated = $this->validated();

        $filters = [];

        if (isset($validated['category'])) {
            $filters['category'] = $validated['category'];
        }

        if (isset($validated['search'])) {
            $filters['search'] = $validated['search'];
        }

        if (isset($validated['status'])) {
            $filters['status'] = $validated['status'];
        }

        if (isset($validated['sort'])) {
            $filters['sort'] = $validated['sort'];
        }

        if (isset($validated['per_page'])) {
            $filters['per_page'] = (int) $validated['per_page'];
        } else {
            $filters['per_page'] = 15;
        }

        if (isset($validated['page'])) {
            $filters['page'] = (int) $validated['page'];
        } else {
            $filters['page'] = 1;
        }

        if (isset($validated['include'])) {
            $filters['include'] = explode(',', $validated['include']);
        }

        if (isset($validated['fields'])) {
            $filters['fields'] = $validated['fields'];
        }

        return $filters;
    }
}
