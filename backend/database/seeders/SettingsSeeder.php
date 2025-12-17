<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing settings
        DB::table('settings')->delete();

        $settings = [
            // General Settings
            ['key' => 'site_name', 'value' => 'SMA Negeri 1 Denpasar', 'type' => 'string', 'group' => 'general', 'label' => 'Nama Sekolah', 'description' => 'Nama resmi sekolah', 'is_public' => true, 'order' => 1],
            ['key' => 'site_short_name', 'value' => 'SMAN 1 Denpasar', 'type' => 'string', 'group' => 'general', 'label' => 'Nama Singkat', 'description' => 'Nama singkatan sekolah', 'is_public' => true, 'order' => 2],
            ['key' => 'site_tagline', 'value' => 'Unggul dalam Prestasi, Berkarakter Pancasila', 'type' => 'string', 'group' => 'general', 'label' => 'Tagline/Motto', 'description' => 'Motto atau tagline sekolah', 'is_public' => true, 'order' => 3],
            ['key' => 'site_description', 'value' => 'SMA Negeri 1 Denpasar adalah lembaga pendidikan menengah atas terkemuka di Denpasar, Bali yang berkomitmen untuk menghasilkan lulusan berkualitas, berkarakter, dan siap menghadapi tantangan global.', 'type' => 'text', 'group' => 'general', 'label' => 'Deskripsi Situs', 'description' => 'Deskripsi lengkap tentang sekolah', 'is_public' => true, 'order' => 4],
            ['key' => 'site_logo', 'value' => '/images/logo.png', 'type' => 'string', 'group' => 'general', 'label' => 'Logo', 'description' => 'URL logo sekolah', 'is_public' => true, 'order' => 5],
            ['key' => 'site_favicon', 'value' => '/favicon.ico', 'type' => 'string', 'group' => 'general', 'label' => 'Favicon', 'description' => 'URL favicon situs', 'is_public' => true, 'order' => 6],
            ['key' => 'established_year', 'value' => '1950', 'type' => 'integer', 'group' => 'general', 'label' => 'Tahun Berdiri', 'description' => 'Tahun berdirinya sekolah', 'is_public' => true, 'order' => 7],
            
            // Contact Settings
            ['key' => 'address', 'value' => 'Jl. Kamboja No. 4, Denpasar, Bali 80111', 'type' => 'text', 'group' => 'contact', 'label' => 'Alamat', 'description' => 'Alamat lengkap sekolah', 'is_public' => true, 'order' => 1],
            ['key' => 'phone', 'value' => '(0361) 226109', 'type' => 'string', 'group' => 'contact', 'label' => 'Telepon', 'description' => 'Nomor telepon sekolah', 'is_public' => true, 'order' => 2],
            ['key' => 'fax', 'value' => '(0361) 226110', 'type' => 'string', 'group' => 'contact', 'label' => 'Fax', 'description' => 'Nomor fax sekolah', 'is_public' => true, 'order' => 3],
            ['key' => 'email', 'value' => 'info@sman1denpasar.sch.id', 'type' => 'string', 'group' => 'contact', 'label' => 'Email', 'description' => 'Email resmi sekolah', 'is_public' => true, 'order' => 4],
            ['key' => 'whatsapp', 'value' => '+628123456789', 'type' => 'string', 'group' => 'contact', 'label' => 'WhatsApp', 'description' => 'Nomor WhatsApp untuk kontak', 'is_public' => true, 'order' => 5],
            ['key' => 'maps_embed', 'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.0667755727185!2d115.2145563!3d-8.6478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDAnMTYuMCJTIDExNsKwMTInNDguNCJF', 'type' => 'text', 'group' => 'contact', 'label' => 'Google Maps Embed URL', 'description' => 'URL embed Google Maps', 'is_public' => true, 'order' => 6],
            ['key' => 'latitude', 'value' => '-8.6478', 'type' => 'string', 'group' => 'contact', 'label' => 'Latitude', 'description' => 'Koordinat latitude lokasi sekolah', 'is_public' => true, 'order' => 7],
            ['key' => 'longitude', 'value' => '115.2145', 'type' => 'string', 'group' => 'contact', 'label' => 'Longitude', 'description' => 'Koordinat longitude lokasi sekolah', 'is_public' => true, 'order' => 8],
            
            // Social Media Settings
            ['key' => 'facebook_url', 'value' => 'https://www.facebook.com/sman1denpasar', 'type' => 'string', 'group' => 'social', 'label' => 'Facebook', 'description' => 'URL Facebook resmi', 'is_public' => true, 'order' => 1],
            ['key' => 'instagram_url', 'value' => 'https://www.instagram.com/sman1denpasar', 'type' => 'string', 'group' => 'social', 'label' => 'Instagram', 'description' => 'URL Instagram resmi', 'is_public' => true, 'order' => 2],
            ['key' => 'youtube_url', 'value' => 'https://www.youtube.com/channel/UCsman1denpasar', 'type' => 'string', 'group' => 'social', 'label' => 'YouTube', 'description' => 'URL YouTube channel', 'is_public' => true, 'order' => 3],
            ['key' => 'twitter_url', 'value' => 'https://twitter.com/sman1denpasar', 'type' => 'string', 'group' => 'social', 'label' => 'Twitter/X', 'description' => 'URL Twitter/X resmi', 'is_public' => true, 'order' => 4],
            ['key' => 'tiktok_url', 'value' => '', 'type' => 'string', 'group' => 'social', 'label' => 'TikTok', 'description' => 'URL TikTok resmi', 'is_public' => true, 'order' => 5],
            
            // Operating Hours
            ['key' => 'weekday_hours', 'value' => '07:00 - 15:00 WITA', 'type' => 'string', 'group' => 'hours', 'label' => 'Jam Senin-Jumat', 'description' => 'Jam operasional hari Senin sampai Jumat', 'is_public' => true, 'order' => 1],
            ['key' => 'saturday_hours', 'value' => '07:00 - 12:00 WITA', 'type' => 'string', 'group' => 'hours', 'label' => 'Jam Sabtu', 'description' => 'Jam operasional hari Sabtu', 'is_public' => true, 'order' => 2],
            ['key' => 'sunday_hours', 'value' => 'Tutup', 'type' => 'string', 'group' => 'hours', 'label' => 'Jam Minggu', 'description' => 'Jam operasional hari Minggu', 'is_public' => true, 'order' => 3],
            
            // Homepage Settings
            ['key' => 'principal_name', 'value' => 'Drs. I Made Sumarta, M.Pd', 'type' => 'string', 'group' => 'homepage', 'label' => 'Nama Kepala Sekolah', 'description' => 'Nama lengkap Kepala Sekolah', 'is_public' => true, 'order' => 1],
            ['key' => 'principal_title', 'value' => 'Kepala Sekolah', 'type' => 'string', 'group' => 'homepage', 'label' => 'Jabatan Kepala Sekolah', 'description' => 'Jabatan resmi Kepala Sekolah', 'is_public' => true, 'order' => 2],
            ['key' => 'principal_message', 'value' => 'Pendidikan bukan hanya tentang transfer ilmu, tetapi juga membentuk karakter dan membangun fondasi untuk masa depan yang gemilang.', 'type' => 'text', 'group' => 'homepage', 'label' => 'Kutipan Kepala Sekolah', 'description' => 'Kutipan atau pesan dari Kepala Sekolah', 'is_public' => true, 'order' => 3],
            ['key' => 'principal_description', 'value' => 'Kami berkomitmen untuk memberikan pendidikan berkualitas tinggi yang tidak hanya fokus pada akademis tetapi juga pengembangan karakter, kreativitas, dan kompetensi abad 21. Bersama-sama, kita akan membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan global.', 'type' => 'text', 'group' => 'homepage', 'label' => 'Deskripsi Sambutan', 'description' => 'Sambutan lengkap dari Kepala Sekolah', 'is_public' => true, 'order' => 4],
            ['key' => 'principal_photo', 'value' => '/images/principal.jpg', 'type' => 'string', 'group' => 'homepage', 'label' => 'Foto Kepala Sekolah', 'description' => 'URL foto Kepala Sekolah', 'is_public' => true, 'order' => 5],
            ['key' => 'principal_since', 'value' => '2020', 'type' => 'string', 'group' => 'homepage', 'label' => 'Menjabat Sejak', 'description' => 'Tahun mulai menjabat sebagai Kepala Sekolah', 'is_public' => true, 'order' => 6],
            ['key' => 'cta_title', 'value' => 'Mulai Langkah Besar Anda Disini', 'type' => 'string', 'group' => 'homepage', 'label' => 'Judul CTA', 'description' => 'Judul untuk Call to Action di homepage', 'is_public' => true, 'order' => 7],
            ['key' => 'cta_subtitle', 'value' => 'Kami membuka pintu untuk masa depan yang cerah dan penuh prestasi', 'type' => 'string', 'group' => 'homepage', 'label' => 'Subtitle CTA', 'description' => 'Subtitle untuk Call to Action', 'is_public' => true, 'order' => 8],
            ['key' => 'cta_button_text', 'value' => 'Hubungi Kami', 'type' => 'string', 'group' => 'homepage', 'label' => 'Teks Tombol CTA', 'description' => 'Teks pada tombol Call to Action', 'is_public' => true, 'order' => 9],
            ['key' => 'cta_button_link', 'value' => '/kontak', 'type' => 'string', 'group' => 'homepage', 'label' => 'Link Tombol CTA', 'description' => 'URL tujuan tombol Call to Action', 'is_public' => true, 'order' => 10],
            
            // SEO Settings
            ['key' => 'meta_title', 'value' => 'SMA Negeri 1 Denpasar - Unggul dalam Prestasi, Berkarakter Pancasila', 'type' => 'string', 'group' => 'seo', 'label' => 'Default Meta Title', 'description' => 'Judul meta default untuk SEO', 'is_public' => true, 'order' => 1],
            ['key' => 'meta_description', 'value' => 'SMA Negeri 1 Denpasar adalah lembaga pendidikan menengah atas terkemuka di Denpasar, Bali yang berkomitmen untuk menghasilkan lulusan berkualitas dan berkarakter.', 'type' => 'text', 'group' => 'seo', 'label' => 'Default Meta Description', 'description' => 'Deskripsi meta default untuk SEO', 'is_public' => true, 'order' => 2],
            ['key' => 'meta_keywords', 'value' => 'SMA Negeri 1 Denpasar, SMANSA, sekolah unggulan, Denpasar, Bali, pendidikan, prestasi, karakter', 'type' => 'text', 'group' => 'seo', 'label' => 'Keywords (comma separated)', 'description' => 'Kata kunci SEO dipisahkan dengan koma', 'is_public' => true, 'order' => 3],
            ['key' => 'og_image', 'value' => '/images/og-default.jpg', 'type' => 'string', 'group' => 'seo', 'label' => 'Default OG Image', 'description' => 'URL gambar default untuk Open Graph', 'is_public' => true, 'order' => 4],
            ['key' => 'google_analytics_id', 'value' => '', 'type' => 'string', 'group' => 'seo', 'label' => 'Google Analytics ID', 'description' => 'ID Google Analytics (GA4)', 'is_public' => false, 'order' => 5],
            ['key' => 'google_tag_manager_id', 'value' => '', 'type' => 'string', 'group' => 'seo', 'label' => 'GTM ID', 'description' => 'ID Google Tag Manager', 'is_public' => false, 'order' => 6],
            
            // Theme Settings
            ['key' => 'primary_color', 'value' => '#2563eb', 'type' => 'string', 'group' => 'theme', 'label' => 'Warna Utama', 'description' => 'Warna primer tema website', 'is_public' => true, 'order' => 1],
            ['key' => 'secondary_color', 'value' => '#4f46e5', 'type' => 'string', 'group' => 'theme', 'label' => 'Warna Sekunder', 'description' => 'Warna sekunder tema website', 'is_public' => true, 'order' => 2],
        ];
        
        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}
