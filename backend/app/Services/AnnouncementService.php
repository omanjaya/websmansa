<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Announcement;
use App\Repositories\AnnouncementRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

final class AnnouncementService extends BaseModelService
{
    protected array $defaultRelations = ['user', 'category'];
    protected string $slugSourceField = 'title';

    public function __construct(AnnouncementRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Backward compatibility wrapper for getFiltered
     */
    public function getFilteredAnnouncements(
        ?string $type = null,
        ?string $priority = null,
        ?bool $isPinned = null,
        ?bool $isActive = null,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        $filters = array_filter([
            'type' => $type,
            'priority' => $priority,
            'is_pinned' => $isPinned,
            'is_active' => $isActive,
        ], fn ($value) => $value !== null);

        return $this->getFiltered($filters, $limit, $paginate);
    }

    /**
     * Get featured announcements
     */
    public function getFeaturedAnnouncements(int $limit = 5): Collection
    {
        return Announcement::query()
            ->with(['user', 'category'])
            ->published()
            ->featured()
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get latest announcements
     */
    public function getLatestAnnouncements(int $limit = 10): Collection
    {
        return Announcement::query()
            ->with(['user', 'category'])
            ->published()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get announcements by type
     */
    public function getAnnouncementsByType(
        string $type,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        return $this->getFiltered(['type' => $type], $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getBySlug
     */
    public function getAnnouncementBySlug(string $slug): Announcement
    {
        return $this->getBySlug($slug);
    }

    /**
     * Backward compatibility wrapper for create
     */
    public function createAnnouncement(array $data, int $userId): Announcement
    {
        return $this->create($data, $userId);
    }

    /**
     * Backward compatibility wrapper for update
     */
    public function updateAnnouncement(Announcement $announcement, array $data): Announcement
    {
        return $this->update($announcement, $data);
    }

    /**
     * Backward compatibility wrapper for delete
     */
    public function deleteAnnouncement(Announcement $announcement): void
    {
        $this->delete($announcement);
    }

    /**
     * Get count of active announcements
     */
    public function getActiveAnnouncementsCount(): int
    {
        return Announcement::query()
            ->published()
            ->count();
    }

    /**
     * Get expired announcements
     */
    public function getExpiredAnnouncements(): Collection
    {
        return Announcement::query()
            ->expired()
            ->get();
    }

    /**
     * Delete expired announcements
     */
    public function deleteExpiredAnnouncements(): int
    {
        $expired = $this->getExpiredAnnouncements();
        $count = $expired->count();

        $expired->each->delete();

        return $count;
    }

    /**
     * Get announcements grouped by priority
     */
    public function getAnnouncementsByPriority(): array
    {
        return [
            'urgent' => $this->getFilteredAnnouncements(priority: 'urgent', limit: 10, paginate: false),
            'high' => $this->getFilteredAnnouncements(priority: 'high', limit: 10, paginate: false),
            'medium' => $this->getFilteredAnnouncements(priority: 'medium', limit: 10, paginate: false),
            'low' => $this->getFilteredAnnouncements(priority: 'low', limit: 10, paginate: false),
        ];
    }

    /**
     * Hook: Customize data before creating announcement
     */
    protected function beforeCreate(array $data): array
    {
        // Set published_at to now if not provided
        if (empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
