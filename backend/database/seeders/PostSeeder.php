<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\PostStatus;
use App\Enums\PostType;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@sman1dps.sch.id')->first();
        $userId = $admin?->id ?? 1;

        $posts = [
            // SCRAPED FROM sman1dps.sch.id - FULL CONTENT
            [
                'title' => 'Emas untuk Smansa! I Nyoman Gede Yajamana Swaha Raih Prestasi Gemilang di 14th ASEAN School Games 2025 Brunei Darussalam! 🇮🇩',
                'excerpt' => 'Prestasi luar biasa ditorehkan oleh I Nyoman Gede Yajamana Swaha (XI.2) dan Desak Nyoman Shiva Pradnyaswari Dewi (XI.4), dalam ajang olahraga pelajar paling bergengsi di Asia Tenggara, 14th ASEAN School Games (ASG) 2025 yang diselenggarakan di Brunei Darussalam pada 23-28 November lalu.',
                'content' => '<p>Keluarga besar SMA Negeri 1 Denpasar kembali berbangga dengan prestasi luar biasa yang ditorehkan oleh dua siswa-siswi terbaiknya, <strong>I Nyoman Gede Yajamana Swaha (XI.2)</strong> dan <strong>Desak Nyoman Shiva Pradnyaswari Dewi (XI.4)</strong>, dalam ajang olahraga pelajar paling bergengsi di Asia Tenggara, 14th ASEAN School Games (ASG) 2025 yang diselenggarakan di Brunei Darussalam pada 23-28 November lalu.</p>

<h3>Kilau Medali Emas Yajamana</h3>
<p>Dalam kompetisi ketat yang diikuti oleh atlet-atlet pelajar terbaik dari negara-negara ASEAN, Yajamana berhasil mengharumkan nama bangsa dan sekolah dengan meraih dua medali emas sekaligus di cabang olahraga renang:</p>
<ul>
<li>🥇 Emas pada nomor <strong>100 Meter Gaya Kupu-kupu Putra</strong> dengan catatan waktu impresif: 55.91 detik.</li>
<li>🥇 Emas pada nomor <strong>4 x 100 Meter Estafet Gaya Ganti Putra</strong>.</li>
</ul>

<p>"Perasaan saya sangat senang dan bangga atas pencapaian ini di tingkat internasional," ujar Yajamana. "Lawan terberat saya rata-rata berasal dari Thailand dan Singapura. Kami memang memilih nomor-nomor ini karena kami melihat peluang besar untuk menang."</p>

<p>Sementara itu, Desak Nyoman Shiva Pradnyaswari Dewi turut berjuang keras mewakili Indonesia di nomor 800 Meter Gaya Bebas Putri dan 200 Meter Gaya Kupu-kupu Putri. Meskipun belum berhasil membawa pulang medali, partisipasi Shiva di ajang bergengsi ini menjadi pengalaman berharga yang mematangkan mental bertanding di kancah internasional.</p>

<h3>Persiapan Intensif</h3>
<p>Prestasi gemilang ini bukanlah didapat dalam waktu singkat. Yajamana dan Shiva mengungkapkan telah fokus berlatih intensif selama kurang lebih 8 bulan. Sebelum melaju ke ASG, mereka bahkan harus memenuhi batas limit (kualifikasi) dengan menggunakan database hasil dari kejuaraan POPNAS.</p>

<p>Pemusatan latihan tim renang Indonesia dilakukan di Jakarta pada 15-21 November. Dalam menghadapi nomor-nomornya di kolam renang, Yajamana mengungkap strateginya, "melakukan imajiner training sehingga kami dapat feeling yang pas" saat bertanding.</p>

<p>Dalam mengimbangi padatnya jadwal latihan—pagi dan sore (di luar jam sekolah)—dengan kewajiban sebagai siswa kelas XI, keduanya menerapkan kedisiplinan tinggi.</p>

<p>"Dukungan terbesar tentunya dari orang tua dan pelatih, tidak lupa juga semangat dari teman-teman," kata Yajamana. Ia juga menekankan pentingnya peran sekolah, "Tanpa dukungan dari sekolah dan guru-guru, kami akan sulit untuk meminta waktu (izin) latihan."</p>

<p>Setelah sukses di ASG, Yajamana dan Shiva tidak berpuas diri. Mereka telah menetapkan target selanjutnya dalam waktu dekat, yaitu berkompetisi di KRASSI pada Januari dan juga PORJAR.</p>

<p><strong>Selamat sekali lagi untuk I Nyoman Gede Yajamana Swaha dan Desak Nyoman Shiva Pradnyaswari Dewi! Kalian adalah inspirasi bagi seluruh siswa SMA Negeri 1 Denpasar. Teruslah berjuang dan harumkan nama Indonesia!</strong></p>',
                'type' => PostType::NEWS,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => true,
                'is_pinned' => true,
                'published_at' => '2025-11-26 08:00:00',
            ],
            [
                'title' => 'Memetik Cahaya di Ladang Jiwa',
                'excerpt' => 'Selamat Hari Guru Nasional. Engkau adalah denyut nadi yang tak pernah lelah memompa keberanian. Engkau adalah Citta—jantung sekolah—tempat segala kebaikan dan pengetahuan bersemi abadi.',
                'content' => '<p>Pada hari yang diselimuti sunyi hormat ini, kita kembali menatap ke cakrawala kelas, ke bangku-bangku usang yang menyimpan bisikan masa depan. Di sana, seorang sosok berdiri tegak, bukan sebagai pemilik otoritas, melainkan sebagai penabur benih sabar di ladang hati yang tak terjamah. Guru, engkau adalah pemahat yang tak pernah menjanjikan patung sempurna, namun kau pastikan setiap guratan di jiwa kami membentuk makna. Engkau adalah Pelita Abadi yang cahayanya tidak pernah mengecil meski telah dibagi pada ribuan lentera di tangan murid-muridmu.</p>

<p>Kami tahu, tugasmu bukanlah sekadar menuntaskan kurikulum, melainkan merangkai rasi bintang di mata yang semula kosong. Kau ajarkan kami bagaimana abjad bisa menjadi sayap, dan angka bisa menjelma jembatan. Namun, di balik semua ilmu pasti dan kisah sejarah yang kau sampaikan, ada filosofi yang kau hidupkan tanpa kata: <em>Bekerja tanpa mengharap balas</em>.</p>

<p>Dalam setiap jam pelajaran yang kau berikan, kau mengamalkan ajaran agung: <strong>"Karmany evadhikaras te ma phalesu kadacana."</strong> Engkau hanya memiliki hak untuk berbuat, untuk berikhtiar seikhlas hati, tanpa pernah menuntut hasil segera atas tetes peluh dan risau yang kau pendam. Karena engkau tahu, hasil itu mungkin baru akan mekar bertahun-tahun kemudian, jauh setelah kami melangkah dari gerbang sekolah ini.</p>

<p>Engkau menanam pohon tanpa perlu melihat teduhnya,<br>
Engkau mengukir tanpa menanti namanya terukir.<br>
Inilah dharma suci seorang pahlawan tanpa tanda jasa; sebuah pengabdian tulus yang melampaui batas hitungan dan pamrih dunia.</p>

<p>Kau adalah arsitek peradaban yang paling mulia, yang rela menjadi tangga agar kami dapat meraih bintang yang belum terjangkau. Kau menenangkan badai dalam keraguan kami, dan kau kokohkan pijakan kami di atas tanah yang goyah.</p>

<p>Maka, di hari suci ini, biarkanlah kami sejenak menundukkan kepala, bukan karena takut, melainkan karena takzim yang mendalam atas setiap keikhlasan yang kau jadikan bekal bagi perjalanan panjang kami.</p>

<p><strong>Selamat Hari Guru Nasional.</strong> Engkau adalah denyut nadi yang tak pernah lelah memompa keberanian. Engkau adalah Citta—jantung sekolah—tempat segala kebaikan dan pengetahuan bersemi abadi. Kami adalah buah dari ketulusanmu, dan pengabdianmu akan selalu menjadi mantra yang membimbing kami pulang ke jalan kebijaksanaan.</p>

<p><em>Sebuah persembahan tulus dari segenap keluarga besar SMA Negeri 1 Denpasar.</em></p>',
                'type' => PostType::NEWS,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => true,
                'is_pinned' => false,
                'published_at' => '2025-11-25 07:00:00',
            ],
            [
                'title' => 'Estafet Kepemimpinan 2025/2026: SMA Negeri 1 Denpasar Sambut Energi Baru OSIS-MPS dengan Semangat Kolaborasi dan Transparansi',
                'excerpt' => 'Serah Terima Jabatan (Sertijab) pengurus Organisasi Siswa Intra Sekolah (OSIS) dan Majelis Perwakilan Siswa (MPS) untuk Masa Bakti 2025–2026.',
                'content' => '<p><strong>Denpasar</strong> – SMA Negeri 1 Denpasar hari ini melaksanakan upacara Serah Terima Jabatan (Sertijab) pengurus Organisasi Siswa Intra Sekolah (OSIS) dan Majelis Perwakilan Siswa (MPS) untuk Masa Bakti 2025–2026. Acara ini menandai berakhirnya periode kepemimpinan yang sukses di bawah komando <strong>I Gde Bramastra Argya Wiraputra</strong> (Ketua OSIS 2024/2025) dan <strong>Ida Ayu Wulan Pradnyani Dewi</strong> (Ketua MPS 2024/2025), sekaligus menyambut visi segar dari <strong>I Kadek Agus Andika Putra</strong> (Ketua OSIS 2025/2026) dan <strong>Anak Agung Ayu Indira Maharani</strong> (Ketua MPS 2025/2026).</p>

<h3>Mengenang Warisan dan Pembelajaran dari Periode 2024–2025</h3>
<p>Ketua OSIS periode sebelumnya, I Gde Bramastra Argya Wiraputra, menyampaikan rasa bangganya terhadap pencapaian terbesar timnya terkait keberhasilan penyelenggaraan "Festival Karmany Smansa (FKS)" yang sukses mengundang artis nasional (RAN dan Reality Club) serta menjadi wadah kreativitas siswa.</p>

<p>Bram menekankan bahwa warisan terpenting yang ingin ia tinggalkan bukanlah program, melainkan budaya kerja OSIS yang profesional namun tetap mengedepankan kekeluargaan dan semangat melayani. Mengenai tantangan, ia mengakui adanya keluhan dari berbagai pihak saat event besar. Namun, hal itu justru menjadi "titik balik" bagi timnya. "Pelajaran terbesarnya adalah, rencana matang harus didukung oleh komunikasi 100% transparan. Dengan itu, kami selalu siap menghadapi masalah," jelas Bram.</p>

<p>Di sisi pengawasan, Ketua MPS demisioner, Ida Ayu Wulan Pradnyani Dewi, menyoroti pentingnya fungsi check and balance. Evaluasi paling signifikan yang dilakukan MPS adalah tentang koordinasi. "MPS merekomendasikan agar OSIS periode selanjutnya lebih aktif berkoordinasi dan berdiskusi dengan Pembina sejak tahap perencanaan kegiatan," ujar Wulan.</p>

<h3>Visi Baru dan Janji Inovasi 2025–2026</h3>
<p>Kepemimpinan baru datang membawa janji perubahan yang lebih inovatif, lincah, dan dekat dengan siswa di era digital.</p>

<p>Ketua OSIS 2025–2026, I Kadek Agus Andika Putra, membawa visi besar untuk menjadikan OSIS wadah yang unggul, kreatif, dan bertanggung jawab di bawah tema <strong>"Gerakan Bersatu (Berintegritas, Solid, Aktif, Tangguh, dan Unggul)"</strong>. Program unggulan yang diusung adalah "Smansa Creative Movement," sebuah kegiatan untuk menampung ide dan bakat siswa lewat lomba inovasi, pameran karya, dan festival seni antar kelas.</p>

<p>"Hal yang ingin saya tingkatkan adalah komunikasi antara OSIS dan siswa. Saya ingin setiap siswa merasa bahwa aspirasinya didengar," tegas Andika. "Kami yakin bisa membawa OSIS lebih dekat dengan siswa melalui banyak cara dan lebih relevan dengan trend anak muda sekarang."</p>

<p>Sementara itu, Ketua MPS 2025–2026, Anak Agung Ayu Indira Maharani, siap memperkuat fungsi pengawasan dengan inovasi. "Pendekatan MPS 2025/2026 akan lebih menekankan pada sistem pengawasan digital berbasis data. Jika sebelumnya bersifat evaluatif, kini akan dilakukan secara berkelanjutan agar perbaikan dapat segera dilakukan," jelas Gung Indy.</p>

<p>Sertijab ini bukan sekadar pergantian nama, melainkan perwujudan komitmen SMA Negeri 1 Denpasar untuk terus beregenerasi dan beradaptasi. Dengan warisan profesionalitas dari kepengurusan lama dan semangat kolaborasi yang dibawa oleh pemimpin baru, sekolah optimis bahwa Masa Bakti 2025–2026 akan dipenuhi dengan program-program inovatif dan prestasi yang membanggakan.</p>',
                'type' => PostType::NEWS,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => true,
                'is_pinned' => false,
                'published_at' => '2025-11-11 09:00:00',
            ],
            [
                'title' => 'Emas Bertabur dari Jakarta! Siswa SMAN 1 Denpasar Ukir Prestasi di POPNAS: Kerja Keras Membuahkan Rekor',
                'excerpt' => 'Dua atlet renang kebanggaan SMA Negeri 1 Denpasar, Desak Nyoman Shiva Pradnyaswari Dewi (Kelas XI) dan I Nyoman Gede Yajamana Swaha (Kelas XI), sukses menyumbangkan Medali Emas bagi Kontingen Bali dalam Pekan Olahraga Pelajar Nasional (POPNAS).',
                'content' => '<p><strong>Denpasar</strong> – Kabar membanggakan datang dari kancah olahraga nasional. Dua atlet renang kebanggaan SMA Negeri 1 Denpasar, <strong>Desak Nyoman Shiva Pradnyaswari Dewi (Kelas XI)</strong> dan <strong>I Nyoman Gede Yajamana Swaha (Kelas XI)</strong>, sukses menyumbangkan Medali Emas bagi Kontingen Bali dalam Pekan Olahraga Pelajar Nasional (POPNAS) yang diselenggarakan di Gelora Bung Karno, Jakarta Pusat. Keduanya mengukir prestasi gemilang setelah melalui persaingan sengit melawan perenang-perenang terbaik dari provinsi kuat seperti DKI Jakarta, Jawa Barat, dan Jawa Timur.</p>

<p>Shiva dan Yajamana tidak hanya meraih satu, melainkan <strong>tiga Medali Emas</strong> di nomor spesialisasi mereka:</p>
<ul>
<li>🥇 <strong>Desak Nyoman Shiva Pradnyaswari Dewi</strong> meraih Emas di nomor 800m Gaya Bebas Putri dan 200m Gaya Kupu-kupu Putri.</li>
<li>🥇 <strong>I Nyoman Gede Yajamana Swaha</strong> meraih Emas di nomor 100m Gaya Kupu-kupu Putra.</li>
</ul>

<p>Kemenangan Shiva di nomor 200m Gaya Kupu-kupu Putri diraih pada hari perlombaan berikutnya, melengkapi koleksi Medali Emasnya, sekaligus memperkuat dominasi SMAN 1 Denpasar di cabang olahraga renang.</p>

<p>Perlombaan final yang menegangkan tersebut dilaksanakan pada 4 November di sesi sore, bertempat di Stadion Akuatik Gelora Bung Karno.</p>

<h3>Kunci Sukses: Disiplin dan Dukungan</h3>
<p>Saat diwawancarai, Shiva dan Yajamana sepakat bahwa Medali Emas ini adalah sebuah "bentuk dari hasil kerja keras selama ini." Mereka menjelaskan faktor-faktor kunci di balik pencapaian luar biasa ini:</p>

<p>"Kami memilih nomor tersebut (800m Gaya Bebas dan 100m Gaya Kupu-kupu) karena di nomor itulah kami memiliki peluang yang besar," ujar Shiva dan Yajamana. "Medali Emas ini bisa diraih karena disiplin latihan pagi dan sore, dan tentu saja dukungan penuh dari keluarga dan pelatih."</p>

<p>Persiapan intensif mereka untuk POPNAS telah dimulai sejak 14 hingga 29 Oktober, dengan latihan rutin harian yang padat di Kolam Renang Tirta Arum Blahkiuh. Pelatih utama yang paling berjasa dalam mempersiapkan mereka adalah <strong>Bapak Dewa Gede Anom Artha Tanaya</strong>.</p>

<h3>Strategi di Detik-Detik Krusial</h3>
<p>Menghadapi lawan seberat perenang dari Jawa dan DKI Jakarta, Yajamana membeberkan strategi mereka, terutama di detik-detik krusial perlombaan:</p>

<p>"Di 50 meter terakhir, kami tentu merasa sangat berat. Tetapi kuncinya adalah tidak boleh panik dan harus tetap mengeluarkan tenaga semaksimal mungkin hingga menyentuh finish," jelas Yajamana.</p>

<p>Mereka juga membagikan tips manajemen waktu yang ketat sebagai siswa kelas XI yang berprestasi: "Kami membagi waktu latihan dengan waktu sekolah. Latihan pagi dari jam 05.00–06.30, kemudian langsung berangkat ke sekolah. Sepulang sekolah, kami langsung latihan sore lagi jam 17.00 sampai selesai," kata Shiva.</p>

<p>Saat menyentuh finish dan mengetahui mereka meraih Emas untuk Bali dan SMA Negeri 1 Denpasar, perasaan yang muncul adalah "sangat senang dan sangat bangga".</p>

<p><strong>Selamat dan sukses selalu untuk Shiva dan Yajamana! Pencapaian ini menjadi inspirasi bagi seluruh siswa SMA Negeri 1 Denpasar untuk terus berjuang meraih prestasi tertinggi di bidang masing-masing.</strong></p>',
                'type' => PostType::NEWS,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => true,
                'is_pinned' => false,
                'published_at' => '2025-11-07 10:00:00',
            ],
            [
                'title' => 'SMANSA Dominasi Panggung Budaya: Raih Juara 2 dan Lolos 10 Besar Duta Endek Kota Denpasar 2025',
                'excerpt' => 'Dua siswa Smansa berhasil menunjukkan kualitas terbaik mereka dalam Pemilihan Duta Endek Kota Denpasar 2025 yang mengusung tema "Sinergi Tradisi dan Teknologi: Endek Denpasar dari Lokal ke Global."',
                'content' => '<p><strong>Denpasar</strong> – SMA Negeri 1 Denpasar (Smansa) kembali menorehkan prestasi gemilang, kali ini di kancah pelestarian budaya. Dua siswa Smansa berhasil menunjukkan kualitas terbaik mereka dalam Pemilihan Duta Endek Kota Denpasar 2025 yang mengusung tema <strong>"Sinergi Tradisi dan Teknologi: Endek Denpasar dari Lokal ke Global."</strong></p>

<p>Dua siswa kebanggaan Smansa yang berhasil meraih gelar prestisius adalah:</p>
<ul>
<li>🏆 <strong>Anak Agung Ayu Angelina Fedora Daiva</strong> – Meraih <strong>Juara 2 Duta Endek Kota Denpasar 2025</strong> (1st Runner-Up).</li>
<li>🎖️ <strong>I Gede Arya Dipa Dirgananta (X-4)</strong> – Berhasil lolos sebagai <strong>Finalis 10 Besar Duta Endek Kota Denpasar 2025</strong>.</li>
</ul>

<p>Capaian ini membuktikan bahwa siswa Smansa unggul tidak hanya dalam ilmu pengetahuan, tetapi juga dalam kepedulian terhadap warisan budaya lokal.</p>

<h3>Rangkaian Kegiatan</h3>
<p>Rangkaian kegiatan Duta Endek 2025 berlangsung intensif selama dua bulan penuh, dimulai sejak Agustus dan mencapai malam puncak pada 27 Oktober 2025. Seluruh kegiatan dilaksanakan di beberapa lokasi utama Denpasar, dengan Pra-Karantina di Gedung Sewaka Dharma dan Dinas Perindustrian dan Perdagangan, serta Malam Grand Final dihelat di Gedung Dharma Negara Alaya (DNA).</p>

<p>Para siswa menunjukkan kemandirian yang tinggi dalam persiapan. Arya Dipa mengembangkan kemampuan otodidak dalam public speaking dan pemahaman budaya, sementara Angelina Fedora mengandalkan bekalnya yang sudah mengikuti beauty pageant sejak kecil, dengan pendalaman materi Endek selama masa karantina.</p>

<h3>Komitmen Pelestarian Budaya</h3>
<p>Tujuan utama keikutsertaan mereka adalah menjadi kontributor nyata dalam pelestarian dan modernisasi Kain Endek.</p>

<p>"Endek adalah warisan budaya leluhur kita yang harus dilestarikan. Melalui kemajuan teknologi dan media sosial, kita bisa mempromosikan kain Endek kepada semua orang melalui konten edukatif yang dapat menarik anak-anak muda," ujar Angelina Fedora.</p>

<p>Sebagai finalis, Arya Dipa juga berkomitmen, "Saya akan melakukan kampanye digital melalui platform digital dan konten kreatif yang diminati oleh generasi muda, agar Endek semakin dikenal sebagai fashion lokal yang berkelas global."</p>

<h3>Pesan untuk Siswa Smansa</h3>
<p>Kedua siswa berprestasi ini menyampaikan pesan penting kepada teman-teman Smansa tentang mencintai dan menggunakan Endek.</p>

<p>Angelina Fedora berkata, "Mari kita jadikan Endek sebagai bagian dari gaya hidup dan kebanggaan kita sehari-hari, karena dengan menggunakannya, kita menjadi garda terdepan yang secara langsung mendukung keberlangsungan ekonomi dan budaya para penenun lokal."</p>

<p>Di sisi lain Arya Dipa menambahkan, "Mari kita bersama-sama menjaga identitas kita sebagai masyarakat Bali dengan mencintai warisan budaya lokal Endek. Lewat kebiasaan sederhana seperti memakai Endek setiap hari Jumat, kita menunjukkan rasa bangga sebagai generasi muda Bali yang tetap menghormati akar budaya."</p>

<p><strong>Selamat kepada Anak Agung Ayu Angelina Fedora Daiva dan I Gede Arya Dipa Dirgananta atas pencapaian luar biasa ini! Smansa bangga atas kontribusi nyata kalian dalam melestarikan budaya Bali.</strong></p>',
                'type' => PostType::NEWS,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => false,
                'is_pinned' => false,
                'published_at' => '2025-11-06 11:00:00',
            ],
            // Pengumuman
            [
                'title' => 'Panduan Seragam SMA Negeri 1 Denpasar',
                'excerpt' => 'Halaman ini kami sajikan untuk memberikan panduan visual yang jelas mengenai aturan seragam harian dari Senin hingga Jumat, seragam olahraga, pakaian adat untuk hari raya tertentu, dan jaket sekolah.',
                'content' => '<h2>Panduan Seragam SMA Negeri 1 Denpasar</h2>

<p>Selamat datang di halaman informasi seragam SMA Negeri 1 Denpasar!</p>

<p>Kami memahami pentingnya keseragaman dan kerapian dalam lingkungan pendidikan, serta ingin memastikan seluruh siswa/i dapat memahami dan mematuhi aturan seragam yang berlaku. Halaman ini kami sajikan untuk memberikan panduan visual yang jelas mengenai aturan seragam harian dari Senin hingga Jumat, seragam olahraga, pakaian adat untuk hari raya tertentu, dan jaket sekolah.</p>

<p>Silakan cermati foto-foto yang tersedia di bawah ini agar Anda dapat mempersiapkan seragam dengan benar setiap harinya.</p>

<p><strong>Dengan mematuhi aturan seragam, kita turut menjaga kedisiplinan dan citra positif sekolah kita tercinta.</strong></p>

<p>Terima kasih atas perhatian dan kerja samanya.</p>',
                'type' => PostType::ANNOUNCEMENT,
                'status' => PostStatus::PUBLISHED,
                'is_featured' => false,
                'is_pinned' => true,
                'published_at' => '2025-07-24 08:00:00',
            ],
        ];

        foreach ($posts as $data) {
            $data['user_id'] = $userId;
            $data['slug'] = Str::slug($data['title']);
            Post::create($data);
        }
    }
}
