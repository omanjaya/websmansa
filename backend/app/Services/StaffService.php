<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Staff;
use App\Repositories\StaffRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

final class StaffService extends BaseModelService
{
    protected array $defaultRelations = ['user', 'media'];
    protected string $slugSourceField = 'name';

    public function __construct(StaffRepository $repository)
    {
        parent::__construct($repository);
    }

    /**
     * Get staff by type - delegates to repository
     */
    public function getStaffByType(
        string $type,
        ?int $limit = null,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        if ($paginate) {
            return $this->getFiltered(['type' => $type], $limit ?? 15, true);
        }
        return $this->repository->getByType($type, $limit);
    }

    /**
     * Get staff by department - delegates to repository
     */
    public function getStaffByDepartment(
        string $department,
        ?int $limit = null,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        if ($paginate) {
            return $this->getFiltered(['department' => $department], $limit ?? 15, true);
        }
        return $this->repository->getByDepartment($department);
    }

    /**
     * Get teachers - delegates to repository
     */
    public function getTeachers(
        ?string $department = null,
        ?int $limit = null,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        $filters = ['type' => 'teacher'];
        if ($department) {
            $filters['department'] = $department;
        }

        return $this->getFiltered($filters, $limit ?? 15, $paginate);
    }

    /**
     * Backward compatibility wrapper for getFiltered
     */
    public function getFilteredStaff(
        array $filters = [],
        int $limit = 15,
        bool $paginate = true
    ): LengthAwarePaginator|Collection {
        return $this->getFiltered($filters, $limit, $paginate);
    }

    /**
     * Backward compatibility wrapper for getFeatured
     */
    public function getFeaturedStaff(int $limit = 6): Collection
    {
        return $this->getFeatured($limit);
    }

    /**
     * Backward compatibility wrapper for getBySlug
     */
    public function getStaffBySlug(string $slug): Staff
    {
        return $this->getBySlug($slug);
    }

    /**
     * Backward compatibility wrapper for create
     */
    public function createStaff(array $data, int $userId): Staff
    {
        return $this->create($data, $userId);
    }

    /**
     * Backward compatibility wrapper for update
     */
    public function updateStaff(Staff $staff, array $data): Staff
    {
        return $this->update($staff, $data);
    }

    /**
     * Backward compatibility wrapper for delete
     */
    public function deleteStaff(Staff $staff): void
    {
        $this->delete($staff);
    }

    /**
     * Get available staff types
     */
    public function getStaffTypes(): array
    {
        return [
            'teacher' => 'Guru',
            'admin' => 'Tata Usaha',
            'staff' => 'Pegawai',
            'headmaster' => 'Kepala Sekolah',
            'vice_headmaster' => 'Wakil Kepala Sekolah',
            'counselor' => 'Bimbingan Konseling',
            'librarian' => 'Pustakawan',
            'lab_assistant' => 'Asisten Laboratorium',
            'security' => 'Satpam',
            'cleaner' => 'Pramubakti',
            'cafeteria' => 'Karyawan Kantin',
        ];
    }

    /**
     * Get available departments
     */
    public function getDepartments(): array
    {
        return [
            'mathematics' => 'Matematika',
            'indonesian' => 'Bahasa Indonesia',
            'english' => 'Bahasa Inggris',
            'physics' => 'Fisika',
            'chemistry' => 'Kimia',
            'biology' => 'Biologi',
            'history' => 'Sejarah',
            'geography' => 'Geografi',
            'economics' => 'Ekonomi',
            'sociology' => 'Sosiologi',
            'civics' => 'PKN',
            'religion' => 'Pendidikan Agama',
            'art' => 'Seni Budaya',
            'music' => 'Musik',
            'pe' => 'Pendidikan Jasmani',
            'it' => 'Teknologi Informasi',
            'counseling' => 'Bimbingan Konseling',
            'library' => 'Perpustakaan',
            'laboratory' => 'Laboratorium',
            'administration' => 'Tata Usaha',
            'finance' => 'Keuangan',
            'student_affairs' => 'Kesiswaan',
            'curriculum' => 'Kurikulum',
            'facilities' => 'Sarana Prasarana',
            'public_relation' => 'Humas',
            'security' => 'Keamanan',
            'cleaning' => 'Kebersihan',
            'cafeteria' => 'Kantin',
            'health' => 'UKS',
        ];
    }

    /**
     * Get staff statistics with caching
     */
    public function getStaffStatistics(): array
    {
        $cacheKey = $this->getCacheKey('statistics', []);

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, $this->cacheTTL, function () {
            $total = Staff::query()->active()->count();
            $teachers = Staff::query()->active()->byType('teacher')->count();
            $admin = Staff::query()->active()->whereIn('type', ['admin', 'staff'])->count();
            $withPhoto = Staff::query()->active()->whereNotNull('photo')->where('photo', '!=', '')->count();

            return [
                'total_staff' => $total,
                'teachers' => $teachers,
                'administrative_staff' => $admin,
                'with_photo' => $withPhoto,
                'teachers_percentage' => $total > 0 ? round(($teachers / $total) * 100, 1) : 0,
                'admin_percentage' => $total > 0 ? round(($admin / $total) * 100, 1) : 0,
                'with_photo_percentage' => $total > 0 ? round(($withPhoto / $total) * 100, 1) : 0,
            ];
        });
    }

    /**
     * Get department statistics
     */
    public function getDepartmentStatistics(): Collection
    {
        return Staff::query()
            ->active()
            ->selectRaw('department, COUNT(*) as count, AVG(experience) as avg_experience')
            ->groupBy('department')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'department' => $item->department,
                    'label' => $this->getDepartments()[$item->department] ?? 'Lainnya',
                    'count' => $item->count,
                    'avg_experience' => round($item->avg_experience, 1),
                ];
            });
    }

    /**
     * Search staff by keyword
     */
    public function searchStaff(string $keyword, int $limit = 20): Collection
    {
        return Staff::query()
            ->with(['user'])
            ->active()
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'like', "%{$keyword}%")
                    ->orWhere('position', 'like', "%{$keyword}%")
                    ->orWhere('email', 'like', "%{$keyword}%")
                    ->orWhere('nip', 'like', "%{$keyword}%")
                    ->orWhereJsonContains('subjects', $keyword);
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('name')
            ->limit($limit)
            ->get();
    }

    /**
     * Get most experienced staff
     */
    public function getMostExperiencedStaff(int $limit = 10): Collection
    {
        return Staff::query()
            ->with(['user'])
            ->active()
            ->whereNotNull('experience')
            ->orderBy('experience', 'desc')
            ->limit($limit)
            ->get();
    }
}
