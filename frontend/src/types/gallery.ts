export interface Media {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  file_name: string;
  mime_type: string;
  path: string;
  disk: string;
  size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  url: string;
  human_size: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  gallery_id: number;
  media_id: number;
  caption?: string;
  order: number;
  created_at: string;
  media: Media;
}

export interface Gallery {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  thumbnail_url?: string;
  type: 'photo' | 'video' | 'mixed';
  event_date?: string;
  is_featured: boolean;
  items_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  items?: GalleryItem[];
}

export interface GalleryFormData {
  title: string;
  slug?: string;
  description?: string;
  type: 'photo' | 'video' | 'mixed';
  event_date?: string;
  is_featured?: boolean;
  thumbnail?: File;
}

export interface GalleryFilters {
  type?: 'photo' | 'video' | 'mixed';
  featured?: boolean;
  search?: string;
  sort?: 'latest' | 'oldest' | 'title';
  per_page?: number;
  page?: number;
}

export interface GalleryListResponse {
  data: Gallery[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UploadMediaResponse {
  message: string;
  data: Gallery;
}
