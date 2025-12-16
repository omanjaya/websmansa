<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Api\UserResource;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Staff */
final class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'staff',
            'attributes' => [
                'nip' => $this->nip,
                'name' => $this->name,
                'full_name' => $this->getFullNameAttribute(),
                'formal_name' => $this->getFormalNameAttribute(),
                'slug' => $this->slug,
                'photo' => $this->photo,
                'photo_url' => $this->getPhotoUrl(),
                'has_photo' => $this->hasPhoto(),
                'position' => $this->position,
                'department' => $this->department,
                'department_label' => $this->getDepartmentLabel(),
                'subjects' => $this->getSubjectsList(),
                'qualifications' => $this->getQualificationsList(),
                'experience' => $this->experience,
                'experience_formatted' => $this->getExperienceFormatted(),
                'email' => $this->email,
                'phone' => $this->phone,
                'display_phone' => $this->getDisplayPhone(),
                'has_contact_info' => $this->hasContactInfo(),
                'social_media' => $this->getSocialMediaLinks(),
                'bio' => $this->when(
                    $request->routeIs('staff.show') || $request->boolean('include_bio'),
                    $this->bio
                ),
                'achievements' => $this->getAchievementsList(),
                'is_active' => $this->is_active,
                'is_featured' => $this->is_featured,
                'type' => $this->type,
                'type_label' => $this->getTypeLabel(),
                'order' => $this->order,
                'created_at' => $this->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            ],
            'relationships' => [
                'user' => $this->when(
                    $this->user && ($request->boolean('include_user') || $request->get('include') === 'user'),
                    new UserResource($this->user)
                ),
            ],
            'meta' => [
                'url' => route('staff.show', $this->slug),
                'has_qualifications' => ! empty($this->qualifications),
                'has_achievements' => ! empty($this->achievements),
                'has_social_media' => ! empty($this->social_media),
                'has_position' => ! empty($this->position),
                'has_nip' => ! empty($this->nip),
                'has_subjects' => ! empty($this->subjects),
                'is_teacher' => $this->type === 'teacher',
                'is_headmaster' => in_array($this->type, ['headmaster', 'vice_headmaster']),
                'is_academic_staff' => in_array($this->type, ['teacher', 'headmaster', 'vice_headmaster', 'counselor', 'librarian', 'lab_assistant']),
                'is_administrative_staff' => in_array($this->type, ['admin', 'staff', 'finance', 'student_affairs', 'curriculum', 'facilities', 'public_relation']),
                'is_support_staff' => in_array($this->type, ['security', 'cleaner', 'cafeteria']),
                'is_new' => $this->created_at->greaterThan(now()->subDays(30)),
                'is_updated' => $this->updated_at->greaterThan($this->created_at->addDay()),
            ],
        ];
    }
}
