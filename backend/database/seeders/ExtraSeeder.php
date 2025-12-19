<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Extra;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ExtraSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sman1dps.sch.id')->first();
        $userId = $admin?->id ?? 1;

        $extras = [
            // Scraped from sman1dps.sch.id
            [
                'name' => 'Sain Ekonomi',
                'description' => 'Ekstrakurikuler Ekonomi merupakan wadah pembinaan dan pengembangan minat peserta didik dalam bidang ilmu ekonomi dan literasi keuangan. Dalam kegiatan ini, peserta didik diajak untuk meningkatkan literasi ekonomi dan keuangan di kalangan peserta didik, melatih kemampuan berpikir kritis dan analitis terhadap isu-isu ekonomi dan membekali peserta didik dengan keterampilan ekonomi praktis untuk kehidupan sehari-hari.

Ekstrakurikuler ini terbuka untuk semua peserta didik yang tertarik memahami ekonomi secara lebih dalam dan siap menjadi generasi muda yang bijak secara finansial serta aktif dalam pembangunan ekonomi bangsa.',
                'short_description' => 'Wadah pengembangan minat dalam bidang ilmu ekonomi dan literasi keuangan.',
                'category' => 'academic',
                'schedule' => 'Setiap Rabu, 15:00 - 17:00 WITA',
                'is_featured' => true,
                'order' => 1,
            ],
            [
                'name' => 'Pramuka',
                'description' => 'Ekstrakurikuler Pramuka di SMA Negeri 1 Denpasar merupakan wadah pembinaan karakter, kedisiplinan, dan kepemimpinan bagi para siswa. Kegiatan ini dilaksanakan secara rutin dan terstruktur, mencakup latihan dasar kepramukaan, pengetahuan survival, keterampilan tali-temali, baris-berbaris, hingga kegiatan perkemahan.

Dengan mengusung semangat Dasa Dharma dan Tri Satya, Pramuka SMANSA menanamkan nilai-nilai tanggung jawab, kerjasama, dan cinta tanah air. Ekstrakurikuler ini tidak hanya mendukung pembentukan karakter siswa, tetapi juga memfasilitasi pengembangan jiwa kepemimpinan melalui berbagai kegiatan seperti lomba kepramukaan, bakti sosial, dan pelatihan keterampilan.

Melalui bimbingan para pembina dan dukungan penuh dari sekolah, Pramuka SMAN 1 Denpasar siap mencetak generasi muda yang mandiri, disiplin, dan berwawasan kebangsaan.',
                'short_description' => 'Wadah pembinaan karakter, kedisiplinan, dan kepemimpinan melalui kegiatan kepramukaan.',
                'category' => 'leadership',
                'schedule' => 'Setiap Sabtu, 07:00 - 12:00 WITA',
                'is_featured' => true,
                'order' => 2,
            ],
            [
                'name' => 'Pencak Silat',
                'description' => 'Pencak Silat SMANSA adalah ekstrakurikuler bela diri tradisional yang bertujuan membentuk siswa yang tangguh, disiplin, dan berkarakter. Melalui latihan rutin, anggota dilatih teknik dasar hingga lanjutan pencak silat, serta dilibatkan dalam berbagai kejuaraan.

Kegiatan ini juga menjadi sarana pelestarian budaya dan pembinaan mental siswa di SMA Negeri 1 Denpasar. Pencak silat mengajarkan bukan hanya kemampuan bela diri, tetapi juga nilai-nilai luhur bangsa Indonesia seperti sportivitas, keberanian, dan pengendalian diri.',
                'short_description' => 'Bela diri tradisional untuk membentuk siswa tangguh, disiplin, dan berkarakter.',
                'category' => 'sports',
                'schedule' => 'Setiap Selasa & Kamis, 15:30 - 17:30 WITA',
                'is_featured' => true,
                'order' => 3,
            ],
            [
                'name' => 'SMANSA Esport',
                'description' => 'SMANSA Esport adalah ekstrakurikuler SMAN 1 Denpasar yang didirikan pada tahun 2022 sebagai wadah pengembangan talenta gaming kompetitif siswa. Berbeda dengan sekadar bermain game, SMANSA Esport berfokus pada pembinaan skill competitive gaming yang terstruktur dan profesional.

Program ini menggabungkan pelatihan teknis gameplay, strategi tim, mental coaching, dan manajemen turnamen untuk mempersiapkan siswa menghadapi kompetisi esport tingkat regional hingga nasional.

Visi: Menjadi organisasi esport terbaik di Bali yang mampu mencetak atlet esport berprestasi dan berkarakter.

Misi:
- Menciptakan atlet esport yang kompeten, berkarakter, dan mampu mengharumkan nama sekolah serta daerah di berbagai ajang kompetisi esport
- Menyumbangkan medali PORJAR (Pekan Olahraga Pelajar Daerah) untuk sekolah setiap tahunnya
- Mengembangkan ekosistem esport yang profesional dan berkelanjutan di lingkungan sekolah',
                'short_description' => 'Wadah pengembangan talenta gaming kompetitif dengan standar profesional.',
                'category' => 'technology',
                'schedule' => 'Setiap Jumat, 15:00 - 17:00 WITA',
                'is_featured' => true,
                'order' => 4,
            ],
            [
                'name' => 'Catur',
                'description' => 'Ekstrakurikuler Catur SMA Negeri 1 Denpasar adalah tempat terbaik untuk mengasah logika, strategi, dan ketenangan berpikir di bawah tekanan. Terbuka untuk pemula hingga pecatur berpengalaman, kegiatan ini membina kemampuan berpikir kritis lewat latihan rutin, sparring seru, dan peluang mengikuti turnamen bergengsi.

Dengan semangat "Gens Una Sumus" (kita adalah satu keluarga), ekstra catur bukan hanya ajang adu strategi, tapi juga tempat tumbuhnya para juara sejati. Siswa akan diajarkan berbagai teknik pembukaan, strategi middle game, dan teknik endgame oleh pembina yang berpengalaman.',
                'short_description' => 'Mengasah logika, strategi, dan ketenangan berpikir melalui olahraga catur.',
                'category' => 'academic',
                'schedule' => 'Setiap Rabu, 15:00 - 17:00 WITA',
                'is_featured' => false,
                'order' => 5,
            ],
            [
                'name' => 'Gateball',
                'description' => 'Ekstrakurikuler Gateball adalah wadah bagi siswa yang ingin mengembangkan kemampuan strategi, kerja sama tim, dan sportivitas melalui olahraga yang unik dan menarik. Gateball merupakan olahraga beregu yang dimainkan di lapangan rumput dengan menggunakan stik dan bola, mirip dengan croquet, namun memiliki aturan dan ritme permainan yang cepat serta membutuhkan konsentrasi tinggi.

Kegiatan ekstrakurikuler ini terbuka untuk semua jenjang dan tidak memerlukan kemampuan fisik khusus, sehingga cocok untuk siswa dari berbagai latar belakang. Dalam latihan, siswa akan diajarkan teknik dasar bermain gateball, pemahaman peraturan permainan, serta strategi tim untuk memenangkan pertandingan.

Melalui ekstrakurikuler Gateball, siswa berkesempatan mengikuti berbagai kejuaraan tingkat daerah hingga nasional, membangun rasa percaya diri dan memperluas jejaring pertemanan.',
                'short_description' => 'Mengembangkan strategi dan kerja sama tim melalui olahraga gateball.',
                'category' => 'sports',
                'schedule' => 'Setiap Selasa & Kamis, 15:30 - 17:00 WITA',
                'is_featured' => false,
                'order' => 6,
            ],
            // Additional mock extras
            [
                'name' => 'Paduan Suara',
                'description' => 'Ekstrakurikuler Paduan Suara SMANSA merupakan wadah bagi siswa yang memiliki minat dan bakat di bidang vokal. Kegiatan ini tidak hanya mengajarkan teknik bernyanyi yang benar, tetapi juga melatih kerja sama tim, disiplin, dan apresiasi terhadap seni musik.

Tim paduan suara SMANSA rutin tampil dalam berbagai acara sekolah, hari besar nasional, dan kompetisi tingkat daerah maupun nasional. Dengan bimbingan pelatih vokal profesional, siswa akan belajar berbagai genre musik dari klasik hingga kontemporer.',
                'short_description' => 'Mengembangkan bakat vokal dan seni musik melalui kegiatan paduan suara.',
                'category' => 'arts',
                'schedule' => 'Setiap Senin & Rabu, 15:00 - 17:00 WITA',
                'is_featured' => true,
                'order' => 7,
            ],
            [
                'name' => 'Basket',
                'description' => 'Tim Basket SMA Negeri 1 Denpasar merupakan salah satu tim basket terbaik di Bali. Ekstrakurikuler ini terbuka untuk siswa putra dan putri yang memiliki minat di bidang olahraga bola basket.

Latihan rutin dilakukan di lapangan basket sekolah dengan fasilitas lengkap. Siswa akan dilatih teknik dasar seperti dribbling, passing, shooting, hingga strategi permainan tim. Tim basket SMANSA rutin mengikuti kompetisi DBL (Development Basketball League) dan berbagai turnamen tingkat daerah dan nasional.',
                'short_description' => 'Tim basket unggulan dengan latihan terstruktur dan partisipasi di berbagai kompetisi.',
                'category' => 'sports',
                'schedule' => 'Setiap Senin, Rabu, Jumat, 15:30 - 17:30 WITA',
                'is_featured' => true,
                'order' => 8,
            ],
            [
                'name' => 'Tari Tradisional Bali',
                'description' => 'Ekstrakurikuler Tari Tradisional Bali merupakan wadah pelestarian budaya dan pengembangan bakat seni tari siswa. Dalam kegiatan ini, siswa akan mempelajari berbagai jenis tarian tradisional Bali seperti Tari Pendet, Tari Legong, Tari Baris, dan tarian kreasi baru.

Dengan bimbingan penari profesional, siswa tidak hanya belajar gerakan tari, tetapi juga memahami makna filosofis di balik setiap gerakan. Ekstra tari SMANSA rutin tampil dalam acara sekolah, festival seni, dan kompetisi FLS2N.',
                'short_description' => 'Pelestarian budaya Bali melalui pembelajaran berbagai tarian tradisional.',
                'category' => 'arts',
                'schedule' => 'Setiap Selasa & Kamis, 15:00 - 17:00 WITA',
                'is_featured' => true,
                'order' => 9,
            ],
            [
                'name' => 'Karya Ilmiah Remaja (KIR)',
                'description' => 'Karya Ilmiah Remaja (KIR) adalah ekstrakurikuler yang membina siswa dalam bidang penelitian dan penulisan ilmiah. Kegiatan ini sangat cocok bagi siswa yang memiliki rasa ingin tahu tinggi dan ingin mengembangkan kemampuan berpikir kritis.

Anggota KIR akan dibimbing untuk merancang penelitian, mengumpulkan data, menganalisis hasil, dan menyusun karya tulis ilmiah. Tim KIR SMANSA telah meraih berbagai prestasi di kompetisi OPSI (Olimpiade Penelitian Siswa Indonesia) dan lomba karya ilmiah tingkat nasional.',
                'short_description' => 'Pembinaan kemampuan penelitian dan penulisan ilmiah untuk siswa.',
                'category' => 'academic',
                'schedule' => 'Setiap Sabtu, 08:00 - 10:00 WITA',
                'is_featured' => true,
                'order' => 10,
            ],
            [
                'name' => 'Palang Merah Remaja (PMR)',
                'description' => 'Palang Merah Remaja (PMR) adalah ekstrakurikuler yang membina siswa dalam bidang kepalangmerahan dan pertolongan pertama. Anggota PMR dilatih untuk memberikan pertolongan pertama pada kecelakaan (P3K), donor darah, dan berbagai kegiatan kemanusiaan.

PMR SMANSA aktif dalam kegiatan bakti sosial, donor darah, dan siaga bencana. Siswa juga dibekali pengetahuan tentang kesehatan dan gaya hidup sehat.',
                'short_description' => 'Pembinaan dalam bidang kepalangmerahan, P3K, dan kegiatan kemanusiaan.',
                'category' => 'social',
                'schedule' => 'Setiap Sabtu, 08:00 - 11:00 WITA',
                'is_featured' => false,
                'order' => 11,
            ],
            [
                'name' => 'English Club',
                'description' => 'English Club adalah ekstrakurikuler yang membantu siswa mengembangkan kemampuan berbahasa Inggris di luar kelas. Kegiatan meliputi conversation practice, debate, public speaking, dan English competition preparation.

Dengan suasana yang menyenangkan dan interaktif, siswa akan lebih percaya diri dalam menggunakan bahasa Inggris. English Club SMANSA rutin mengikuti berbagai lomba debat dan speech competition tingkat daerah dan nasional.',
                'short_description' => 'Pengembangan kemampuan berbahasa Inggris melalui kegiatan interaktif.',
                'category' => 'language',
                'schedule' => 'Setiap Jumat, 15:00 - 17:00 WITA',
                'is_featured' => false,
                'order' => 12,
            ],
        ];

        foreach ($extras as $data) {
            $data['user_id'] = $userId;
            $data['slug'] = Str::slug($data['name']);
            $data['is_active'] = true;
            Extra::create($data);
        }
    }
}
