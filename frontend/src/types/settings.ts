// Dynamic Settings Type Definitions
// This file contains all the settings that can be configured from the admin panel

export interface SiteSettings {
  // General Settings
  site_name: string;
  site_short_name: string;
  site_tagline: string;
  site_description: string;
  site_logo: string;
  site_favicon: string;
  logo_url: string;
  established_year: number;
  founded_year: string;

  // Contact Settings
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  fax: string;
  email: string;
  whatsapp: string;
  maps_embed: string;
  latitude: string;
  longitude: string;
  departments: Department[];

  // Social Media Settings
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  tiktok_url: string;

  // Operating Hours
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;

  // Homepage Settings
  principal_name: string;
  principal_title: string;
  principal_message: string;
  principal_description: string;
  principal_photo: string;
  principal_since: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  cta_button_link: string;

  // About Page Settings
  total_students: string;
  total_teachers: string;
  total_alumni: string;
  visi: string;
  misi: string[];
  sejarah: HistoryItem[];

  // SEO Settings
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  google_analytics_id: string;
  google_tag_manager_id: string;

  // Theme Settings
  primary_color: string;
  secondary_color: string;
}

// Department type for contact page
export interface Department {
  name: string;
  email: string;
  phone: string;
}

// History item type for about page
export interface HistoryItem {
  year: string;
  title: string;
  description: string;
}

// Default values for fallback
export const defaultSettings: SiteSettings = {
  // General
  site_name: 'SMA Negeri 1 Denpasar',
  site_short_name: 'SMAN 1 Denpasar',
  site_tagline: 'Unggul dalam Prestasi, Berkarakter Pancasila',
  site_description: 'SMA Negeri 1 Denpasar adalah lembaga pendidikan menengah atas terkemuka di Denpasar, Bali yang berkomitmen untuk menghasilkan lulusan berkualitas, berkarakter, dan siap menghadapi tantangan global.',
  site_logo: '/images/logo.png',
  site_favicon: '/favicon.ico',
  logo_url: '/images/logo.png',
  established_year: 1950,
  founded_year: '1950',

  // Contact
  address: 'Jl. Kamboja No. 4, Denpasar, Bali 80111',
  city: 'Denpasar',
  province: 'Bali',
  postal_code: '80111',
  phone: '(0361) 226109',
  fax: '(0361) 226110',
  email: 'info@sman1denpasar.sch.id',
  whatsapp: '+628123456789',
  maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.0667755727185!2d115.2145563!3d-8.6478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDAnMTYuMCJTIDExNsKwMTInNDguNCJF',
  latitude: '-8.6478',
  longitude: '115.2145',
  departments: [
    { name: 'Tata Usaha', email: 'tata.usaha@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 101' },
    { name: 'Kesiswaan', email: 'kesiswaan@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 102' },
    { name: 'Kurikulum', email: 'kurikulum@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 103' },
    { name: 'Bimbingan Konseling', email: 'bk@sman1denpasar.sch.id', phone: '(0361) 226109 ext. 104' },
  ],

  // Social
  facebook_url: 'https://www.facebook.com/sman1denpasar',
  instagram_url: 'https://www.instagram.com/sman1denpasar',
  youtube_url: 'https://www.youtube.com/channel/UCsman1denpasar',
  twitter_url: 'https://twitter.com/sman1denpasar',
  tiktok_url: '',

  // Hours
  weekday_hours: '07:00 - 15:00 WITA',
  saturday_hours: '07:00 - 12:00 WITA',
  sunday_hours: 'Tutup',

  // Homepage
  principal_name: 'Drs. I Made Sumarta, M.Pd',
  principal_title: 'Kepala Sekolah',
  principal_message: 'Pendidikan bukan hanya tentang transfer ilmu, tetapi juga membentuk karakter dan membangun fondasi untuk masa depan yang gemilang.',
  principal_description: 'Kami berkomitmen untuk memberikan pendidikan berkualitas tinggi yang tidak hanya fokus pada akademis tetapi juga pengembangan karakter, kreativitas, dan kompetensi abad 21. Bersama-sama, kita akan membentuk generasi yang cerdas, berkarakter, dan siap menghadapi tantangan global.',
  principal_photo: '/images/principal.jpg',
  principal_since: '2020',
  cta_title: 'Mulai Langkah Besar Anda Disini',
  cta_subtitle: 'Kami membuka pintu untuk masa depan yang cerah dan penuh prestasi',
  cta_button_text: 'Hubungi Kami',
  cta_button_link: '/kontak',

  // About Page
  total_students: '1200',
  total_teachers: '120',
  total_alumni: '50000',
  visi: 'Menjadi sekolah unggul yang menghasilkan lulusan berprestasi, berkarakter Pancasila, berwawasan global, dan berbudaya lingkungan.',
  misi: [
    'Menyelenggarakan pendidikan yang berkualitas dan berstandar nasional/internasional',
    'Mengembangkan potensi akademik dan non-akademik peserta didik secara optimal',
    'Membentuk karakter peserta didik yang berbudi pekerti luhur berdasarkan nilai-nilai Pancasila',
    'Membangun lingkungan sekolah yang kondusif, aman, dan nyaman untuk pembelajaran',
    'Mengembangkan kemitraan dengan berbagai pihak untuk peningkatan mutu pendidikan',
    'Melestarikan budaya lokal dan mengintegrasikannya dalam pembelajaran',
  ],
  sejarah: [
    { year: '1950', title: 'Pendirian Sekolah', description: 'SMA Negeri 1 Denpasar didirikan sebagai salah satu sekolah menengah atas pertama di Bali.' },
    { year: '1960', title: 'Perkembangan Awal', description: 'Mulai berkembang dengan penambahan fasilitas dan peningkatan jumlah siswa.' },
    { year: '1980', title: 'Status Unggulan', description: 'Ditetapkan sebagai salah satu sekolah unggulan di Provinsi Bali.' },
    { year: '2000', title: 'Modernisasi', description: 'Renovasi besar-besaran dan penambahan fasilitas modern untuk mendukung pembelajaran.' },
    { year: '2020', title: 'Era Digital', description: 'Transformasi digital dengan pembelajaran hybrid dan fasilitas teknologi terkini.' },
  ],

  // SEO
  meta_title: 'SMA Negeri 1 Denpasar - Unggul dalam Prestasi, Berkarakter Pancasila',
  meta_description: 'SMA Negeri 1 Denpasar adalah lembaga pendidikan menengah atas terkemuka di Denpasar, Bali yang berkomitmen untuk menghasilkan lulusan berkualitas dan berkarakter.',
  meta_keywords: 'SMA Negeri 1 Denpasar, SMANSA, sekolah unggulan, Denpasar, Bali, pendidikan, prestasi, karakter',
  og_image: '/images/og-default.jpg',
  google_analytics_id: '',
  google_tag_manager_id: '',

  // Theme
  primary_color: '#2563eb',
  secondary_color: '#4f46e5',
};

// Settings group types for admin panel
export type SettingGroup =
  | 'general'
  | 'contact'
  | 'social'
  | 'hours'
  | 'homepage'
  | 'about'
  | 'seo'
  | 'theme';

// Setting item type for admin
export interface SettingItem {
  id: number;
  key: string;
  value: string | null;
  type: 'string' | 'text' | 'boolean' | 'integer' | 'json';
  group: SettingGroup;
  label?: string | null;
  description?: string | null;
  is_public: boolean;
  options?: any | null;
  order: number;
  created_at: string;
  updated_at: string;
}

// Settings update payload
export interface SettingUpdatePayload {
  key: string;
  value: any;
  type?: string;
  group?: string;
}

// Settings group configuration for admin panel
export const settingGroupsConfig = {
  general: {
    label: 'Umum',
    description: 'Informasi umum tentang sekolah',
    icon: 'BuildingOfficeIcon',
    order: 1,
  },
  contact: {
    label: 'Kontak & Lokasi',
    description: 'Informasi kontak dan lokasi sekolah',
    icon: 'MapPinIcon',
    order: 2,
  },
  social: {
    label: 'Media Sosial',
    description: 'Link media sosial sekolah',
    icon: 'ShareIcon',
    order: 3,
  },
  hours: {
    label: 'Jam Operasional',
    description: 'Jam operasional sekolah',
    icon: 'ClockIcon',
    order: 4,
  },
  homepage: {
    label: 'Homepage',
    description: 'Konten khusus halaman depan',
    icon: 'HomeIcon',
    order: 5,
  },
  about: {
    label: 'Tentang',
    description: 'Konten halaman Tentang (visi, misi, sejarah, statistik)',
    icon: 'InformationCircleIcon',
    order: 6,
  },
  seo: {
    label: 'SEO & Analytics',
    description: 'Pengaturan SEO dan analytics',
    icon: 'ChartBarIcon',
    order: 7,
  },
  theme: {
    label: 'Tema & Branding',
    description: 'Warna dan branding',
    icon: 'PaletteIcon',
    order: 8,
  },
} as const;
