<?php

declare(strict_types=1);

namespace App\Http\Requests\Staff;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $staffId = $this->route('staff')?->id;

        return [
            'nip' => 'nullable|string|max:50|unique:staff,nip,'.$staffId,
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:staff,slug,'.$staffId,
            'photo' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|in:mathematics,indonesian,english,physics,chemistry,biology,history,geography,economics,sociology,civics,religion,art,music,pe,it,counseling,library,laboratory,administration,finance,student_affairs,curriculum,facilities,public_relation,security,cleaning,cafeteria,health',
            'subjects' => 'nullable|array',
            'subjects.*' => 'string|max:100',
            'qualifications' => 'nullable|array',
            'qualifications.*' => 'string|max:255',
            'experience' => 'nullable|integer|min:0|max:100',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'social_media' => 'nullable|array',
            'social_media.*.platform' => 'required_with:social_media|string|max:50',
            'social_media.*.url' => 'required_with:social_media|url|max:255',
            'bio' => 'nullable|string|max:2000',
            'achievements' => 'nullable|array',
            'achievements.*' => 'string|max:500',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0|max:9999',
            'type' => 'sometimes|required|string|in:teacher,admin,staff,headmaster,vice_headmaster,counselor,librarian,lab_assistant,security,cleaner,cafeteria',
        ];
    }

    public function messages(): array
    {
        return [
            'nip.unique' => 'NIP sudah digunakan',
            'nip.max' => 'NIP maksimal 50 karakter',
            'name.required' => 'Nama lengkap wajib diisi',
            'name.max' => 'Nama maksimal 255 karakter',
            'slug.unique' => 'Slug sudah digunakan',
            'photo.max' => 'Path foto maksimal 255 karakter',
            'position.max' => 'Jabatan maksimal 255 karakter',
            'department.in' => 'Departemen harus salah satu dari: mathematics, indonesian, english, physics, chemistry, biology, history, geography, economics, sociology, civics, religion, art, music, pe, it, counseling, library, laboratory, administration, finance, student_affairs, curriculum, facilities, public_relation, security, cleaning, cafeteria, health',
            'subjects.*.max' => 'Setiap mata pelajaran maksimal 100 karakter',
            'qualifications.*.max' => 'Setiap kualifikasi maksimal 255 karakter',
            'experience.min' => 'Pengalaman minimal 0 tahun',
            'experience.max' => 'Pengalaman maksimal 100 tahun',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'phone.max' => 'Telepon maksimal 20 karakter',
            'social_media.*.platform.required_with' => 'Platform media sosial wajib diisi',
            'social_media.*.platform.max' => 'Platform maksimal 50 karakter',
            'social_media.*.url.required_with' => 'URL media sosial wajib diisi',
            'social_media.*.url.url' => 'Format URL tidak valid',
            'social_media.*.url.max' => 'URL maksimal 255 karakter',
            'bio.max' => 'Biografi maksimal 2000 karakter',
            'achievements.*.max' => 'Setiap pencapaian maksimal 500 karakter',
            'order.min' => 'Urutan minimal 0',
            'order.max' => 'Urutan maksimal 9999',
            'type.required' => 'Tipe staff wajib diisi',
            'type.in' => 'Tipe staff harus salah satu dari: teacher, admin, staff, headmaster, vice_headmaster, counselor, librarian, lab_assistant, security, cleaner, cafeteria',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
            'order' => $this->integer('order', 0),
            'experience' => $this->integer('experience', 0),
        ]);
    }
}
