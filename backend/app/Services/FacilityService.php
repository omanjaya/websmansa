<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Facility;
use App\Repositories\FacilityRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

final class FacilityService extends BaseModelService
{
    protected array $defaultRelations = ['user'];
    protected string $slugSourceField = 'name';

    public function __construct(FacilityRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Backward compatibility wrapper for getFiltered
     */
    public function getFilteredFacilities(
        ?string $category = null,
        ?bool $isActive = null,
        ?bool $isFeatured = null,
        ?bool $hasBooking = null,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        $filters = array_filter([
            'category' => $category,
            'is_active' => $isActive,
            'is_featured' => $isFeatured,
            'has_booking' => $hasBooking,
        ], fn ($value) => $value !== null);

        return $this->getFiltered($filters, $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getFeatured
     */
    public function getFeaturedFacilities(int $limit = 6): Collection
    {
        return $this->getFeatured($limit);
    }

    /**
     * Get facilities by category - delegates to repository
     */
    public function getFacilitiesByCategory(
        string $category,
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        return $this->getFiltered(['category' => $category], $limit, $paginate);
    }

    /**
     * Get bookable facilities
     */
    public function getBookableFacilities(
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        return $this->getFiltered(['has_booking' => true], $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getBySlug
     */
    public function getFacilityBySlug(string $slug): Facility
    {
        return $this->getBySlug($slug);
    }

    /**
     * Backward compatibility wrapper for create
     */
    public function createFacility(array $data, int $userId): Facility
    {
        return $this->create($data, $userId);
    }

    /**
     * Backward compatibility wrapper for update
     */
    public function updateFacility(Facility $facility, array $data): Facility
    {
        return $this->update($facility, $data);
    }

    /**
     * Backward compatibility wrapper for delete
     */
    public function deleteFacility(Facility $facility): void
    {
        $this->delete($facility);
    }

    /**
     * Get facility categories with counts
     */
    public function getFacilityCategories(): array
    {
        $categories = [
            'classroom' => ['name' => 'Ruang Kelas', 'count' => 0],
            'laboratory' => ['name' => 'Laboratorium', 'count' => 0],
            'library' => ['name' => 'Perpustakaan', 'count' => 0],
            'sports' => ['name' => 'Fasilitas Olahraga', 'count' => 0],
            'canteen' => ['name' => 'Kantin', 'count' => 0],
            'health' => ['name' => 'UKS', 'count' => 0],
            'auditorium' => ['name' => 'Aula', 'count' => 0],
            'multipurpose' => ['name' => 'Ruang Serbaguna', 'count' => 0],
            'parking' => ['name' => 'Area Parkir', 'count' => 0],
            'worship' => ['name' => 'Tempat Ibadah', 'count' => 0],
            'toilet' => ['name' => 'Toilet', 'count' => 0],
            'garden' => ['name' => 'Taman', 'count' => 0],
            'computer' => ['name' => 'Lab. Komputer', 'count' => 0],
            'science' => ['name' => 'Lab. IPA', 'count' => 0],
            'language' => ['name' => 'Lab. Bahasa', 'count' => 0],
            'art' => ['name' => 'Studio Seni', 'count' => 0],
            'music' => ['name' => 'Ruang Musik', 'count' => 0],
        ];

        $counts = Facility::query()
            ->active()
            ->selectRaw('category, COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count', 'category');

        foreach ($categories as $key => &$value) {
            $value['count'] = $counts[$key] ?? 0;
        }

        return $categories;
    }

    /**
     * Get facilities by capacity (highest to lowest)
     */
    public function getFacilitiesByCapacity(): Collection
    {
        return Facility::query()
            ->active()
            ->whereNotNull('capacity')
            ->orderBy('capacity', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'slug', 'category', 'capacity', 'location']);
    }

    /**
     * Get facilities by area (largest to smallest)
     */
    public function getFacilitiesByArea(): Collection
    {
        return Facility::query()
            ->active()
            ->whereNotNull('area')
            ->orderBy('area', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'slug', 'category', 'area', 'location']);
    }

    /**
     * Get count of bookable facilities
     */
    public function getBookableFacilitiesCount(): int
    {
        return Facility::query()
            ->active()
            ->whereNotNull('booking_url')
            ->where('booking_url', '!=', '')
            ->count();
    }

    /**
     * Get total capacity across all facilities
     */
    public function getTotalFacilityCapacity(): int
    {
        return Facility::query()
            ->active()
            ->whereNotNull('capacity')
            ->sum('capacity');
    }

    /**
     * Get total area across all facilities
     */
    public function getTotalFacilityArea(): int
    {
        return Facility::query()
            ->active()
            ->whereNotNull('area')
            ->sum('area');
    }

    /**
     * Get facilities statistics
     */
    public function getFacilitiesStatistics(): array
    {
        $total = Facility::query()->active()->count();
        $totalArea = $this->getTotalFacilityArea();
        $totalCapacity = $this->getTotalFacilityCapacity();
        $bookable = $this->getBookableFacilitiesCount();

        return [
            'total_facilities' => $total,
            'total_area' => $totalArea,
            'total_capacity' => $totalCapacity,
            'bookable_facilities' => $bookable,
            'average_area' => $total > 0 ? round($totalArea / $total) : 0,
            'average_capacity' => $total > 0 ? round($totalCapacity / $total) : 0,
            'bookable_percentage' => $total > 0 ? round(($bookable / $total) * 100, 1) : 0,
        ];
    }

    /**
     * Search facilities by keyword
     */
    public function searchFacilities(string $keyword, int $limit = 20): Collection
    {
        return Facility::query()
            ->with(['user'])
            ->active()
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%")
                    ->orWhere('location', 'like', "%{$keyword}%")
                    ->orWhereJsonContains('facilities', $keyword);
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    /**
     * Hook: Customize data before creating facility
     */
    protected function beforeCreate(array $data): array
    {
        // Ensure booking_url is null if empty
        if (empty($data['booking_url'])) {
            $data['booking_url'] = null;
        }

        return $data;
    }
}
