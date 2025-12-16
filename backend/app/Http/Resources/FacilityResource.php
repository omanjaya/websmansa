<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Api\UserResource;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Facility */
final class FacilityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'facility',
            'attributes' => [
                'name' => $this->name,
                'slug' => $this->slug,
                'description' => $this->when(
                    $request->routeIs('facilities.show') || $request->boolean('include_description'),
                    $this->description
                ),
                'category' => $this->category,
                'category_label' => $this->getCategoryLabel(),
                'location' => $this->location,
                'capacity' => $this->capacity,
                'capacity_label' => $this->getCapacityFormatted(),
                'area' => $this->area,
                'area_formatted' => $this->getAreaFormatted(),
                'facilities' => $this->getFacilitiesList(),
                'main_image' => $this->getMainImage(),
                'images' => $this->images ?? [],
                'rules' => $this->getRulesList(),
                'booking_url' => $this->booking_url,
                'has_booking' => $this->hasBooking(),
                'can_be_booked' => $this->canBeBooked(),
                'is_active' => $this->is_active,
                'is_featured' => $this->is_featured,
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
                'url' => route('facilities.show', $this->slug),
                'has_images' => ! empty($this->images),
                'has_facilities' => ! empty($this->facilities),
                'has_rules' => ! empty($this->rules),
                'has_location' => ! empty($this->location),
                'has_capacity' => ! empty($this->capacity),
                'has_area' => ! empty($this->area),
                'is_new' => $this->created_at->greaterThan(now()->subDays(30)),
                'is_updated' => $this->updated_at->greaterThan($this->created_at->addDay()),
                'booking_action_url' => $this->when($this->canBeBooked(), $this->booking_url),
            ],
        ];
    }
}
