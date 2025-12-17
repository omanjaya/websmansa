<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $settings = [
            // About Page - Stats
            ['key' => 'total_students', 'value' => '1200', 'type' => 'string', 'group' => 'about', 'label' => 'Jumlah Siswa Aktif', 'description' => 'Total siswa aktif saat ini', 'is_public' => true, 'order' => 1],
            ['key' => 'total_teachers', 'value' => '120', 'type' => 'string', 'group' => 'about', 'label' => 'Jumlah Guru & Staff', 'description' => 'Total guru dan tenaga kependidikan', 'is_public' => true, 'order' => 2],
            ['key' => 'total_alumni', 'value' => '50000', 'type' => 'string', 'group' => 'about', 'label' => 'Jumlah Alumni', 'description' => 'Total alumni sejak berdiri', 'is_public' => true, 'order' => 3],

            // About Page - Vision & Mission
            ['key' => 'visi', 'value' => 'Menjadi sekolah unggul yang menghasilkan lulusan berprestasi, berkarakter Pancasila, berwawasan global, dan berbudaya lingkungan.', 'type' => 'text', 'group' => 'about', 'label' => 'Visi', 'description' => 'Visi sekolah', 'is_public' => true, 'order' => 4],
            ['key' => 'misi', 'value' => json_encode([
                'Menyelenggarakan pendidikan yang berkualitas dan berstandar nasional/internasional',
                'Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal',
                'Membentuk karakter peserta didik yang berbudi pekerti luhur berdasarkan nilai-nilai Pancasila',
                'Membangun lingkungan sekolah yang kondusif, aman, dan nyaman untuk pembelajaran',
                'Mengembangkan kemitraan dengan berbagai pihak untuk peningkatan mutu pendidikan',
                'Melestarikan budaya lokal dan mengintegrasikannya dalam pembelajaran',
            ]), 'type' => 'json', 'group' => 'about', 'label' => 'Misi', 'description' => 'Misi sekolah (dalam bentuk list)', 'is_public' => true, 'order' => 5],

            // About Page - History Timeline
            ['key' => 'sejarah', 'value' => json_encode([
                ['year' => '1950', 'title' => 'Pendirian Sekolah', 'description' => 'SMA Negeri 1 Denpasar didirikan sebagai salah satu sekolah menengah atas pertama di Bali.'],
                ['year' => '1960', 'title' => 'Perkembangan Awal', 'description' => 'Mulai berkembang dengan penambahan fasilitas dan peningkatan jumlah siswa.'],
                ['year' => '1980', 'title' => 'Status Unggulan', 'description' => 'Ditetapkan sebagai salah satu sekolah unggulan di Provinsi Bali.'],
                ['year' => '2000', 'title' => 'Modernisasi', 'description' => 'Renovasi besar-besaran dan penambahan fasilitas modern untuk mendukung pembelajaran.'],
                ['year' => '2020', 'title' => 'Era Digital', 'description' => 'Transformasi digital dengan pembelajaran hybrid dan fasilitas teknologi terkini.'],
            ]), 'type' => 'json', 'group' => 'about', 'label' => 'Sejarah/Timeline', 'description' => 'Timeline sejarah sekolah', 'is_public' => true, 'order' => 6],

            // Contact Page - Departments
            ['key' => 'departments', 'value' => json_encode([
                ['name' => 'Tata Usaha', 'email' => 'tata.usaha@sman1denpasar.sch.id', 'phone' => '(0361) 226109 ext. 101'],
                ['name' => 'Kesiswaan', 'email' => 'kesiswaan@sman1denpasar.sch.id', 'phone' => '(0361) 226109 ext. 102'],
                ['name' => 'Kurikulum', 'email' => 'kurikulum@sman1denpasar.sch.id', 'phone' => '(0361) 226109 ext. 103'],
                ['name' => 'Bimbingan Konseling', 'email' => 'bk@sman1denpasar.sch.id', 'phone' => '(0361) 226109 ext. 104'],
            ]), 'type' => 'json', 'group' => 'contact', 'label' => 'Departemen/Bagian', 'description' => 'Daftar departemen/bagian dengan kontak masing-masing', 'is_public' => true, 'order' => 10],
        ];

        foreach ($settings as $setting) {
            // Check if setting already exists
            $exists = DB::table('settings')->where('key', $setting['key'])->exists();

            if (!$exists) {
                DB::table('settings')->insert(array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'total_students',
            'total_teachers',
            'total_alumni',
            'visi',
            'misi',
            'sejarah',
            'departments',
        ])->delete();
    }
};
