<?php

declare(strict_types=1);

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;

final class IndexAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'nullable|string|in:info,event,warning,success',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'is_pinned' => 'nullable|in:0,1,true,false',
            'is_active' => 'nullable|in:0,1,true,false',
            'limit' => 'nullable|integer|min:1|max:100',
            'paginate' => 'nullable|in:0,1,true,false',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Tipe pengumuman harus salah satu dari: info, event, warning, success',
            'priority.in' => 'Prioritas harus salah satu dari: low, medium, high, urgent',
            'limit.min' => 'Limit minimal adalah 1',
            'limit.max' => 'Limit maksimal adalah 100',
        ];
    }
}
