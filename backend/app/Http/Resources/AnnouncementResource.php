<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\Api\CategoryResource;
use App\Http\Resources\Api\UserResource;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Announcement */
final class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => 'announcement',
            'attributes' => [
                'title' => $this->title,
                'slug' => $this->slug,
                'content' => $this->when(
                    $request->routeIs('announcements.show') || $request->boolean('include_content'),
                    $this->content
                ),
                'excerpt' => $this->excerpt,
                'type' => $this->type,
                'type_label' => $this->getTypeLabel(),
                'priority' => $this->priority,
                'priority_label' => $this->getPriorityLabel(),
                'is_pinned' => $this->is_pinned,
                'is_active' => $this->is_active,
                'is_expired' => $this->isExpired(),
                'can_be_displayed' => $this->canBeDisplayed(),
                'published_at' => $this->published_at?->format('Y-m-d H:i:s'),
                'expires_at' => $this->expires_at?->format('Y-m-d H:i:s'),
                'created_at' => $this->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            ],
            'relationships' => [
                'category' => $this->when(
                    $this->category && ($request->boolean('include_category') || $request->get('include') === 'category'),
                    new CategoryResource($this->category)
                ),
                'user' => $this->when(
                    $this->user && ($request->boolean('include_user') || $request->get('include') === 'user'),
                    new UserResource($this->user)
                ),
            ],
            'meta' => [
                'url' => route('announcements.show', $this->slug),
                'display_duration' => $this->calculateDisplayDuration(),
                'days_until_expiry' => $this->daysUntilExpiry(),
                'is_new' => $this->created_at->greaterThan(now()->subDays(7)),
                'is_updated' => $this->updated_at->greaterThan($this->created_at->addDay()),
            ],
        ];
    }

    private function calculateDisplayDuration(): ?string
    {
        if (! $this->published_at || ! $this->expires_at) {
            return null;
        }

        $duration = $this->published_at->diffInDays($this->expires_at);

        return $duration > 0 ? "{$duration} hari" : null;
    }

    private function daysUntilExpiry(): ?int
    {
        if (! $this->expires_at) {
            return null;
        }

        return $this->expires_at->isFuture()
            ? (int) now()->diffInDays($this->expires_at)
            : null;
    }
}
