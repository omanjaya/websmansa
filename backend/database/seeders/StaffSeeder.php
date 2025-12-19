<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sman1dps.sch.id')->first();
        $userId = $admin?->id ?? 1;

        $staff = [
            [
                'nip' => '196507151990031006',
                'name' => 'Drs. I Wayan Sudiarsa, M.Pd',
                'position' => 'Kepala Sekolah',
                'department' => 'administration',
                'type' => 'headmaster',
                'qualifications' => ['S2 Manajemen Pendidikan'],
                'experience' => 34,
                'email' => 'kepala@sman1dps.sch.id',
                'bio' => 'Kepala Sekolah SMAN 1 Denpasar.',
                'is_active' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'nip' => '197203201998012003',
                'name' => 'Dra. Ni Made Sukerti, M.Pd',
                'position' => 'Wakil Kepala Sekolah Bidang Kurikulum',
                'department' => 'curriculum',
                'type' => 'vice_headmaster',
                'subjects' => ['Matematika'],
                'qualifications' => ['S2 Pendidikan Matematika'],
                'experience' => 26,
                'email' => 'kurikulum@sman1dps.sch.id',
                'is_active' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'nip' => '197508151999031002',
                'name' => 'I Made Sugiarta, S.Pd, M.Pd',
                'position' => 'Wakil Kepala Sekolah Bidang Kesiswaan',
                'department' => 'student_affairs',
                'type' => 'vice_headmaster',
                'subjects' => ['Pendidikan Jasmani'],
                'experience' => 25,
                'is_active' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'nip' => '197806152002122004',
                'name' => 'Drs. I Wayan Sudana, M.Pd',
                'position' => 'Guru Fisika',
                'department' => 'physics',
                'type' => 'teacher',
                'subjects' => ['Fisika'],
                'experience' => 22,
                'is_active' => true,
                'order' => 10,
            ],
            [
                'nip' => '198203102006042008',
                'name' => 'I Gede Artha, S.Pd, M.Si',
                'position' => 'Guru Matematika',
                'department' => 'mathematics',
                'type' => 'teacher',
                'subjects' => ['Matematika'],
                'experience' => 18,
                'is_active' => true,
                'order' => 11,
            ],
            [
                'nip' => '198505202010012015',
                'name' => 'Ni Luh Gede Ari, S.E, M.Ec',
                'position' => 'Guru Ekonomi',
                'department' => 'economics',
                'type' => 'teacher',
                'subjects' => ['Ekonomi'],
                'experience' => 14,
                'is_active' => true,
                'order' => 12,
            ],
            [
                'nip' => '198709152012042003',
                'name' => 'Ni Wayan Pagawati, S.Sn',
                'position' => 'Guru Seni Budaya',
                'department' => 'art',
                'type' => 'teacher',
                'subjects' => ['Seni Budaya'],
                'experience' => 12,
                'is_active' => true,
                'order' => 13,
            ],
            [
                'nip' => '199105152018041002',
                'name' => 'I Gede Harry Wirawan, S.Pd',
                'position' => 'Guru Informatika',
                'department' => 'it',
                'type' => 'teacher',
                'subjects' => ['Informatika'],
                'experience' => 6,
                'is_active' => true,
                'order' => 15,
            ],
            [
                'nip' => '198812102014042001',
                'name' => 'Ni Made Dewi Lestari, S.Pd',
                'position' => 'Guru Bahasa Inggris',
                'department' => 'english',
                'type' => 'teacher',
                'subjects' => ['Bahasa Inggris'],
                'experience' => 10,
                'is_active' => true,
                'order' => 16,
            ],
            [
                'nip' => '199206102019041003',
                'name' => 'I Kadek Swartana Putra, S.Pd',
                'position' => 'Guru Pendidikan Jasmani',
                'department' => 'pe',
                'type' => 'teacher',
                'subjects' => ['PJOK'],
                'experience' => 5,
                'is_active' => true,
                'order' => 17,
            ],
            [
                'nip' => '198908152015042001',
                'name' => 'Ni Kadek Ayu Suartini, S.Pd, M.Pd',
                'position' => 'Guru Bimbingan Konseling',
                'department' => 'counseling',
                'type' => 'counselor',
                'experience' => 9,
                'is_active' => true,
                'order' => 20,
            ],
            [
                'nip' => '197505152000032001',
                'name' => 'Ni Wayan Suartini',
                'position' => 'Kepala Tata Usaha',
                'department' => 'administration',
                'type' => 'admin',
                'experience' => 24,
                'is_active' => true,
                'order' => 30,
            ],
        ];

        foreach ($staff as $data) {
            $data['user_id'] = $userId;
            $data['slug'] = Str::slug($data['name']);
            Staff::create($data);
        }
    }
}
