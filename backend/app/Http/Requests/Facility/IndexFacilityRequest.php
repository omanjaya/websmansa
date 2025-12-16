<?php

declare(strict_types=1);

namespace App\Http\Requests\Facility;

use Illuminate\Foundation\Http\FormRequest;

final class IndexFacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => 'nullable|string|in:classroom,laboratory,library,sports,canteen,health,auditorium,multipurpose,parking,worship,toilet,garden,computer,science,language,art,music',
            'is_active' => 'nullable|in:0,1,true,false',
            'is_featured' => 'nullable|in:0,1,true,false',
            'has_booking' => 'nullable|in:0,1,true,false',
            'limit' => 'nullable|integer|min:1|max:100',
            'paginate' => 'nullable|in:0,1,true,false',
        ];
    }

    public function messages(): array
    {
        return [
            'category.in' => 'Kategori fasilitas harus salah satu dari: classroom, laboratory, library, sports, canteen, health, auditorium, multipurpose, parking, worship, toilet, garden, computer, science, language, art, music',
            'limit.min' => 'Limit minimal adalah 1',
            'limit.max' => 'Limit maksimal adalah 100',
        ];
    }
}
