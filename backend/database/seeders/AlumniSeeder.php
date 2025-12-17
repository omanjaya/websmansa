<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Alumni;
use Illuminate\Database\Seeder;

class AlumniSeeder extends Seeder
{
    public function run(): void
    {
        $alumni = [
            [
                'name' => 'Dr. I Gusti Ngurah Agung Suryawan',
                'graduation_year' => 2008,
                'class' => 'XII IPA 1',
                'current_occupation' => 'Dokter Spesialis Bedah',
                'current_institution' => 'RSUP Sanglah Denpasar',
                'category' => 'Kedokteran',
                'quote' => 'Pendidikan di SMANSA mengajarkan saya untuk selalu berpikir kritis dan tidak mudah menyerah. Nilai-nilai inilah yang membawa saya hingga saat ini.',
                'achievements' => 'Lulusan Terbaik FK Unud 2014, Spesialis Bedah Terbaik 2020',
                'bio' => 'Menyelesaikan pendidikan kedokteran di Universitas Udayana dan spesialisasi bedah di UI. Aktif dalam kegiatan sosial kesehatan di Bali.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'Ni Made Ayu Pratiwi',
                'graduation_year' => 2012,
                'class' => 'XII IPS 2',
                'current_occupation' => 'CEO & Founder',
                'current_institution' => 'Bali Organic Foods',
                'category' => 'Entrepreneur',
                'quote' => 'SMANSA membentuk karakter saya untuk berani bermimpi besar dan bekerja keras mewujudkannya.',
                'achievements' => 'Forbes 30 Under 30 Asia 2022, Best Social Enterprise Award 2023',
                'bio' => 'Pendiri startup agritech yang memberdayakan petani lokal Bali. Lulusan MBA dari Stanford University.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'I Putu Gede Arya Wijaya',
                'graduation_year' => 2010,
                'class' => 'XII IPA 3',
                'current_occupation' => 'Diplomat',
                'current_institution' => 'Kementerian Luar Negeri RI',
                'category' => 'Diplomat',
                'quote' => 'Belajar di SMANSA dengan keberagaman budaya mempersiapkan saya untuk karir diplomasi internasional.',
                'achievements' => 'Second Secretary KBRI Tokyo, Delegasi Indonesia di UN Youth Assembly',
                'bio' => 'Diplomat muda Indonesia yang bertugas di berbagai negara. Lulusan Hubungan Internasional UI dan School of International Studies, Johns Hopkins.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'Kadek Dwi Ananda',
                'graduation_year' => 2015,
                'class' => 'XII IPA 1',
                'current_occupation' => 'Software Engineer',
                'current_institution' => 'Google Singapore',
                'category' => 'Teknologi',
                'quote' => 'Fondasi logika dan matematika dari SMANSA sangat membantu karir saya di bidang teknologi.',
                'achievements' => 'Google Code Jam Finalist 2019, Open Source Contributor of the Year 2021',
                'bio' => 'Software Engineer di Google, fokus pada machine learning. Lulusan Computer Science NUS dengan predikat summa cum laude.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 4,
            ],
            [
                'name' => 'Ni Luh Putu Eka Sari',
                'graduation_year' => 2014,
                'class' => 'XII IPS 1',
                'current_occupation' => 'Dosen & Peneliti',
                'current_institution' => 'Universitas Udayana',
                'category' => 'Akademisi',
                'quote' => 'SMANSA mengajarkan saya mencintai ilmu pengetahuan dan terus belajar sepanjang hayat.',
                'achievements' => 'PhD Economics MIT, Young Economist Award ISEI 2023',
                'bio' => 'Dosen Fakultas Ekonomi Unud dengan spesialisasi ekonomi pembangunan. Peneliti aktif di bidang sustainable tourism.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 5,
            ],
            [
                'name' => 'I Wayan Gede Arta Kusuma',
                'graduation_year' => 2011,
                'class' => 'XII Bahasa',
                'current_occupation' => 'Seniman & Koreografer',
                'current_institution' => 'Bali Arts Festival',
                'category' => 'Seni',
                'quote' => 'Kegiatan seni di SMANSA menumbuhkan kecintaan saya pada budaya Bali dan seni pertunjukan.',
                'achievements' => 'Best Choreographer SEA Games 2019, UNESCO Artist of Peace 2022',
                'bio' => 'Koreografer tari kontemporer yang menggabungkan tradisi Bali dengan modern dance. Tampil di berbagai festival internasional.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => true,
                'order' => 6,
            ],
            [
                'name' => 'Dr. Anak Agung Gede Rai Putra',
                'graduation_year' => 2006,
                'class' => 'XII IPA 2',
                'current_occupation' => 'Dokter Spesialis Jantung',
                'current_institution' => 'RS Bali Royal Hospital',
                'category' => 'Kedokteran',
                'quote' => 'Disiplin dan kerja keras yang ditanamkan SMANSA adalah bekal utama saya menjadi dokter.',
                'achievements' => 'Fellowship Cardiology Harvard, Best Cardiologist Bali 2022',
                'bio' => 'Kardiolog interventional dengan pengalaman di Harvard Medical School. Pelopor teknik kateterisasi jantung di Bali.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => false,
                'order' => 7,
            ],
            [
                'name' => 'Made Surya Dharma',
                'graduation_year' => 2013,
                'class' => 'XII IPA 1',
                'current_occupation' => 'Data Scientist',
                'current_institution' => 'Gojek Indonesia',
                'category' => 'Teknologi',
                'quote' => 'Kompetisi sains di SMANSA mengasah kemampuan analitis yang sangat berguna di data science.',
                'achievements' => 'Kaggle Grandmaster, Speaker PyCon ID 2023',
                'bio' => 'Lead Data Scientist di Gojek, mengembangkan algoritma untuk optimasi transportasi. Kontributor aktif komunitas data science Indonesia.',
                'is_public' => true,
                'is_verified' => true,
                'is_featured' => false,
                'order' => 8,
            ],
        ];

        foreach ($alumni as $data) {
            Alumni::create($data);
        }
    }
}
