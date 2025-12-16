<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Extra;
use App\Models\User;
use App\Repositories\ExtraRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

final class ExtraService extends BaseModelService
{
    protected array $defaultRelations = ['user', 'members'];
    protected string $slugSourceField = 'name';

    public function __construct(ExtraRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Backward compatibility wrapper for getFiltered
     */
    public function getFilteredExtras(
        ?string $category = null,
        ?bool $isActive = null,
        ?bool $isFeatured = null,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        $filters = array_filter([
            'category' => $category,
            'is_active' => $isActive,
            'is_featured' => $isFeatured,
        ], fn ($value) => $value !== null);

        return $this->getFiltered($filters, $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getFeatured
     */
    public function getFeaturedExtras(int $limit = 6): Collection
    {
        return Extra::query()
            ->with(['user'])
            ->active()
            ->featured()
            ->withCount('members')
            ->ordered()
            ->limit($limit)
            ->get();
    }

    /**
     * Get extras by category
     */
    public function getExtrasByCategory(
        string $category,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        return $this->getFiltered(['category' => $category], $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getBySlug
     */
    public function getExtraBySlug(string $slug): Extra
    {
        return Extra::query()
            ->with(['user', 'members' => fn ($q) => $q->withPivot('role', 'joined_at')])
            ->withCount('members')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * Backward compatibility wrapper for create
     */
    public function createExtra(array $data, int $userId): Extra
    {
        return $this->create($data, $userId);
    }

    /**
     * Backward compatibility wrapper for update
     */
    public function updateExtra(Extra $extra, array $data): Extra
    {
        return $this->update($extra, $data);
    }

    /**
     * Backward compatibility wrapper for delete
     */
    public function deleteExtra(Extra $extra): void
    {
        $this->delete($extra);
    }

    /**
     * Join extra - domain-specific business logic
     */
    public function joinExtra(Extra $extra, User $user): array
    {
        if (! $extra->is_active) {
            return [
                'success' => false,
                'message' => 'Ekstrakurikuler tidak aktif',
                'extra' => $extra,
            ];
        }

        if ($extra->isUserMember($user)) {
            return [
                'success' => false,
                'message' => 'Anda sudah menjadi anggota',
                'extra' => $extra,
            ];
        }

        if (! $extra->hasAvailableSlots()) {
            return [
                'success' => false,
                'message' => 'Kuota ekstrakurikuler sudah penuh',
                'extra' => $extra,
            ];
        }

        $extra->members()->attach($user->id, [
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return [
            'success' => true,
            'message' => 'Berhasil bergabung dengan ekstrakurikuler',
            'extra' => $extra->fresh(['user', 'members']),
        ];
    }

    /**
     * Leave extra - domain-specific business logic
     */
    public function leaveExtra(Extra $extra, User $user): array
    {
        if (! $extra->isUserMember($user)) {
            return [
                'success' => false,
                'message' => 'Anda bukan anggota ekstrakurikuler ini',
                'extra' => $extra,
            ];
        }

        $extra->members()->detach($user->id);

        return [
            'success' => true,
            'message' => 'Berhasil keluar dari ekstrakurikuler',
            'extra' => $extra->fresh(['user', 'members']),
        ];
    }

    /**
     * Get members of an extra
     */
    public function getExtraMembers(Extra $extra, ?string $role = null, int $limit = 50): Collection
    {
        $query = $extra->members()
            ->withPivot('role', 'joined_at')
            ->select('users.id', 'users.name', 'users.email', 'users.avatar')
            ->orderByPivot('joined_at', 'asc');

        if ($role) {
            $query->wherePivot('role', $role);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Get popular extras by member count
     */
    public function getPopularExtras(int $limit = 10): Collection
    {
        return Extra::query()
            ->with(['user'])
            ->active()
            ->withCount('members')
            ->orderBy('members_count', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    /**
     * Get extras grouped by member count statistics
     */
    public function getExtrasByMemberCount(): Collection
    {
        return Extra::query()
            ->active()
            ->withCount('members')
            ->get()
            ->groupBy('category')
            ->map(fn ($items) => [
                'category' => $items->first()->category,
                'label' => $items->first()->getCategoryLabel(),
                'count' => $items->count(),
                'total_members' => $items->sum('members_count'),
                'avg_members' => round($items->avg('members_count'), 1),
            ])
            ->sortByDesc('total_members')
            ->values();
    }

    /**
     * Get extra categories with counts
     */
    public function getExtraCategories(): array
    {
        $categories = [
            'sports' => ['name' => 'Olahraga', 'count' => 0],
            'arts' => ['name' => 'Kesenian', 'count' => 0],
            'academic' => ['name' => 'Akademik', 'count' => 0],
            'social' => ['name' => 'Sosial', 'count' => 0],
            'technology' => ['name' => 'Teknologi', 'count' => 0],
            'language' => ['name' => 'Bahasa', 'count' => 0],
            'leadership' => ['name' => 'Kepemimpinan', 'count' => 0],
            'volunteer' => ['name' => 'Kerelawanan', 'count' => 0],
            'religious' => ['name' => 'Keagamaan', 'count' => 0],
        ];

        $counts = Extra::query()
            ->active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        foreach ($categories as $key => &$value) {
            $value['count'] = $counts[$key] ?? 0;
        }

        return $categories;
    }
}
