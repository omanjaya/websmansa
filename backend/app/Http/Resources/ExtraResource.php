<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Api\UserResource;
use App\Models\Extra;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Extra */
final class ExtraResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'type' => 'extra',
            'attributes' => [
                'name' => $this->name,
                'slug' => $this->slug,
                'description' => $this->when(
                    $request->routeIs('extras.show') || $request->boolean('include_description'),
                    $this->description
                ),
                'short_description' => $this->short_description,
                'category' => $this->category,
                'category_label' => $this->getCategoryLabel(),
                'schedule' => $this->schedule,
                'schedule_formatted' => $this->getScheduleFormatted(),
                'contact_person' => $this->contact_person,
                'contact_phone' => $this->contact_phone,
                'contact_email' => $this->contact_email,
                'requirements' => $this->requirements ?? [],
                'capacity' => $this->capacity,
                'capacity_label' => $this->getCapacityLabel(),
                'available_slots' => $this->getAvailableSlots(),
                'has_available_slots' => $this->hasAvailableSlots(),
                'logo' => $this->logo,
                'images' => $this->images ?? [],
                'is_active' => $this->is_active,
                'is_featured' => $this->is_featured,
                'is_member' => $user ? $this->isUserMember($user) : false,
                'can_join' => $user ? ! $this->isUserMember($user) && $this->hasAvailableSlots() : false,
                'order' => $this->order,
                'created_at' => $this->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            ],
            'relationships' => [
                'user' => $this->when(
                    $this->user && ($request->boolean('include_user') || $request->get('include') === 'user'),
                    new UserResource($this->user)
                ),
                'members' => $this->when(
                    ($this->members_count ?? null) !== null || $request->get('include') === 'members',
                    [
                        'count' => $this->when(isset($this->members_count), $this->members_count),
                        'data' => $this->when(
                            $request->get('include') === 'members',
                            $this->members->map(function ($member) {
                                return [
                                    'id' => $member->id,
                                    'name' => $member->name,
                                    'avatar' => $member->avatar,
                                    'role' => $member->pivot->role,
                                    'joined_at' => $member->pivot->joined_at,
                                ];
                            })
                        ),
                    ]
                ),
            ],
            'meta' => [
                'url' => route('extras.show', $this->slug),
                'has_contact_info' => ! empty($this->contact_person) || ! empty($this->contact_phone) || ! empty($this->contact_email),
                'has_requirements' => ! empty($this->requirements),
                'has_schedule' => ! empty($this->schedule),
                'has_images' => ! empty($this->images),
                'is_new' => $this->created_at->greaterThan(now()->subDays(30)),
                'is_updated' => $this->updated_at->greaterThan($this->created_at->addDay()),
                'join_action_url' => $this->when($user && ! $this->isUserMember($user) && $this->hasAvailableSlots(), route('extras.join', $this->id)),
                'leave_action_url' => $this->when($user && $this->isUserMember($user), route('extras.leave', $this->id)),
            ],
        ];
    }
}
