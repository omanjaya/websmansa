<?php

declare(strict_types=1);

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;

final class IndexStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'nullable|string|in:teacher,admin,staff,headmaster,vice_headmaster,counselor,librarian,lab_assistant,security,cleaner,cafeteria',
            'department' => 'nullable|string|in:mathematics,indonesian,english,physics,chemistry,biology,history,geography,economics,sociology,civics,religion,art,music,pe,it,counseling,library,laboratory,administration,finance,student_affairs,curriculum,facilities,public_relation,security,cleaning,cafeteria,health',
            'is_active' => 'nullable|in:0,1,true,false',
            'is_featured' => 'nullable|in:0,1,true,false',
            'has_photo' => 'nullable|in:0,1,true,false',
            'limit' => 'nullable|integer|min:1|max:100',
            'paginate' => 'nullable|in:0,1,true,false',
        ];
    }

    public function messages(): array
    {
        return [
            'type.in' => 'Tipe staff harus salah satu dari: teacher, admin, staff, headmaster, vice_headmaster, counselor, librarian, lab_assistant, security, cleaner, cafeteria',
            'department.in' => 'Departemen harus salah satu dari: mathematics, indonesian, english, physics, chemistry, biology, history, geography, economics, sociology, civics, religion, art, music, pe, it, counseling, library, laboratory, administration, finance, student_affairs, curriculum, facilities, public_relation, security, cleaning, cafeteria, health',
            'limit.min' => 'Limit minimal adalah 1',
            'limit.max' => 'Limit maksimal adalah 100',
        ];
    }
}
